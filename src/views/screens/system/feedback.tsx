import React from 'react';
import Screen from 'src/views/components/screen';
import { StyleSheet, View, KeyboardAvoidingView, Button } from 'react-native';
import {
  Text,
  Strong,
  TextArea,
  PrimaryButton,
  TextInput
} from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { KeyboardDismissView } from 'src/views/components/keyboard-dismiss-view';
import validator from 'validator';
import { Dispatch } from 'redux';
import { submitFeedback } from 'src/store/sagas/feedback';
import { connect } from 'react-redux';
import SupportMessage from 'src/models/support-message';
import WonderAppState from 'src/models/wonder-app-state';
import { Content } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import StateButton from 'src/views/components/theme/buttons/state-button';

interface FeedbackScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onSubmitFeedback: (body: SupportMessage) => any;
}

interface FeedbackScreenState {
  subject: string;
  body: string;
  subjectError: boolean;
  bodyError: boolean;
  subjectErrorText: string;
  bodyErrorText: string;
}

const mapState = (state: WonderAppState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  onSubmitFeedback: (feedback: SupportMessage) =>
    dispatch(submitFeedback(feedback))
});

// automatically get name and email from user in redux
class FeedbackScreen extends React.Component<
  FeedbackScreenProps,
  FeedbackScreenState
> {
  state: FeedbackScreenState = {
    subject: '',
    body: '',
    subjectError: false,
    bodyError: false,
    subjectErrorText: 'Please add a subject',
    bodyErrorText: 'Please add some information about your query',
    data: {}
  };

  onChangeSubjectText = (text: string) => {
    this.setState({ subject: text });
  }

  onChangebodyText = (text: string) => {
    this.setState({ body: text });
  }

  getImage = () => {
    const options: Options = {
      title: 'Upload a Photo',
      mediaType: 'photo'
    };

    ImagePicker.showImagePicker(options, (res: Response) => {
      if (res.didCancel) {
        // console.log("User cancelled!");
      } else if (res.error) {
        // console.log("Error", res.error);
      } else {
        this.setState({ data: res });
      }
    });
  }

  submit = () => {
    const { subject, body, data } = this.state;
    const { onSubmitFeedback, navigation } = this.props;
    if (!validator.isEmpty(subject) && !validator.isEmpty(body)) {
      onSubmitFeedback({ subject, body, file: data.uri });
      navigation.goBack();
    } else {
      if (validator.isEmpty(subject)) {
        this.setState({ subjectError: true });
      }
      if (validator.isEmpty(body)) {
        this.setState({ bodyError: true });
      }
    }
  }

  render() {
    const { navigation } = this.props;
    const {
      subjectError,
      bodyError,
      subjectErrorText,
      bodyErrorText
    } = this.state;

    return (
      <Screen horizontalPadding={20} style={{ paddingBottom: 20 }}>
        <Content>
          {/* <KeyboardAvoidingView
            behavior="position"
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1 }}
          >
            <KeyboardDismissView style={{ flex: 1 }}> */}
          <Text style={styles.infoText}>
            We want you to have a{' '}
            <Strong style={{ color: theme.colors.primary }}>Wonderful</Strong>{' '}
            experience! We would love to hear your feedback.
          </Text>
          <View>
            {subjectError && (
              <Text style={{ fontSize: 10, color: 'red' }}>
                {subjectErrorText}
              </Text>
            )}
            <TextInput
              onFocus={() => this.setState({ subjectError: false })}
              placeholder='Subject'
              onChangeText={this.onChangeSubjectText}
            />
            <View
              style={{
                padding: 5,
                backgroundColor: '#E1E1E1',
                marginBottom: 10,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <StateButton
                active={true}
                text='Add File'
                onPress={this.getImage}
              />
              {this.state.data.uri && <Text>slected image</Text>}
            </View>
            {bodyError && (
              <Text style={{ fontSize: 10, color: 'red' }}>
                {bodyErrorText}
              </Text>
            )}
            <TextArea
              onFocus={() => this.setState({ bodyError: false })}
              onChangeText={this.onChangebodyText}
              placeholder='Message...'
              style={{
                minHeight: 150,
                backgroundColor: '#E1E1E1',
                color: '#444'
              }}
            />
          </View>
          {/* </KeyboardDismissView>
          </KeyboardAvoidingView> */}
        </Content>

        <PrimaryButton title='Submit' onPress={this.submit} />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(FeedbackScreen);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15
  },
  infoText: {
    fontSize: 18,
    paddingHorizontal: 25,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20
  }
});

/**
 * Created by tianyu on 2017/9/8.
 */
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
} from 'react-native';
import {Button, Overlay, Input} from 'teaset'
import Colors from '../common/Colors'

export const DialogView = ({containerStyle, children, onClosePress}) => {
  return (
    <View style={containerStyle}>
      <View style={styles.top}>
        <Image style={styles.decorate} source={require('../assets/dialog_top.png')}/>
        <TouchableOpacity onPress={onClosePress}>
          <Image style={styles.close} source={require('../assets/dialog_close.png')}/>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        {children}
      </View>
      <Image style={styles.bottom} source={require('../assets/dialog_bottom.png')}/>
    </View>
  )
}

export function showDialog(content, otherProps = {}) {
  let key;
  let OverlayRef;
  let overlayView = (
    <Overlay.PopView ref={ref => OverlayRef = ref} style={{alignItems: 'center', justifyContent: 'center'}}
                     autoKeyboardInsets={true} {...otherProps}>
      <DialogView onClosePress={() => OverlayRef && OverlayRef.close()}>
        {content}
      </DialogView>
    </Overlay.PopView>
  );
  key = Overlay.show(overlayView);
  return key;
}

export function showInputDialog(title, placeholder, onTextChanged) {
  let key;
  let text;
  key = showDialog((
    <View>
      <Text style={{alignSelf: 'center'}}>---------------{title || "输入"}---------------</Text>
      <Input
        style={styles.textInput}
        placeholder={placeholder || "请输入文字"}
        placeholderTextColor="rgb(204,204,204)"
        underlineColorAndroid="transparent"
        onChangeText={t => text = t}
      />
      <Button style={styles.button} titleStyle={styles.buttonText} title="确定" onPress={() => {
        key && Overlay.hide(key)
        onTextChanged && onTextChanged(text);
      }}/>
    </View>
  ))
  return key;
}

export function showAlertDialog(title, message, onConfirm, confirmBtnText, onCancel, cancelBtnText) {
  let key;
  key = showDialog((
    <View>
      <Text style={{alignSelf: 'center'}}>---------------{title || "提示"}---------------</Text>
      <Text style={{alignSelf: 'center', marginTop: em(32), fontSize: em(34)}}>{message}</Text>
      <View style={{flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
        {
          onCancel ?
            <Button style={styles.button} titleStyle={styles.buttonText} title={cancelBtnText || "取消"}
                    onPress={() => {
                      key && Overlay.hide(key)
                      onCancel && onCancel()
                    }}/> : null
        }
        <Button style={styles.button} titleStyle={styles.buttonText} title={confirmBtnText || "确定"} onPress={() => {
          key && Overlay.hide(key)
          onConfirm && onConfirm()
        }}/>
      </View>
    </View>
  ))
  return key;
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  decorate: {
    marginRight: em(134)
  },
  close: {
    marginRight: em(34)
  },
  bottom: {
    alignSelf: 'flex-end'
  },
  main: {
    padding: em(27),
    borderRadius: em(20),
    backgroundColor: '#fff',
    width: SCREEN_WIDTH * 0.9,
  },
  button: {
    borderRadius: em(20),
    backgroundColor: Colors.navColor,
    borderWidth: 0,
    marginTop: em(32),
    paddingVertical: em(20),
    paddingHorizontal: em(40),
    marginHorizontal: em(24)
  },
  buttonText: {
    color: '#fff'
  },
  textInput: {
    borderRadius: em(20),
    backgroundColor: Colors.bgColor,
    marginTop: em(32),
    borderWidth: 0
  }
});


import { createStackNavigator, createAppContainer } from "react-navigation";
import MyProfileScreen from "../pages/MyProfileScreen"
import IndexScreen from '../pages/index'
import LoginScreen from "../pages/LoginScreen";
import RegisterScreen from "../pages/RegisterScreen";
import ForgetPasswordScreen from '../pages/ForgetPasswordScreen';
import QrCodeScreen from "../pages/QrCodeScreen";
import MakeFriendScreen from '../pages/MakeFriendScreen';
import WorkScreen from '../pages/WorkScreen'
import SoundScreen from "../pages/SoundScreen";
import SoundListScreen from "../pages/SoundListScreen";

export const AppNavigator = createStackNavigator({
  
  Index: {
    screen: IndexScreen
  },
  Work: {
    screen: WorkScreen
  },
  MyProfile: {
    screen: MyProfileScreen
  },
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  },
  ForgetPassword: {
    screen: ForgetPasswordScreen
  },
  QRCode:{
    screen:QrCodeScreen
  },

  MakeFriend:{
    screen:MakeFriendScreen
  },
  Sound:{
    screen:SoundScreen
  },
  SoundList:{
    screen:SoundListScreen
  }
  // AppDrawerNavigator: {
  //   screen: ActivityDrawer,
  //   navigationOptions: {
  //     gesturesEnabled: false,
  //   }
  // },

  // Register: {
  //   screen: Register,
  // },

},
{
  initialRouteName: 'SoundList',
  /* The header config from HomeScreen is now here */
  initialRouteParams: {},
  mode: 'card',
  headerMode: 'screen',


  /*
    默认配置。跟RouteConfigs中的navigationOptions和组件的static navigationOptions相比，级别最低
    */
  navigationOptions: {
    gesturesEnabled: true,
    headerTitleStyle: {alignSelf: 'center'},
    headerStyle: {backgroundColor: 'rgb(248,183,41)'},
    header: null
  }

}
);

export  const AppContainer = createAppContainer(AppNavigator);

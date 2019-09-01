# Mokirim

## Development preparation

Make sure file change detection works:
```
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
$  sudo sysctl -p
```

## Make sure Facebook login works

Add Facebook app ID to strings.xml

## Run development device deployer
```
$ react-native start
```
Run this to deploy on device/emulator:
```
$ react-native run-android
```

┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ NativeBase 2.0 has been succesfully installed!                                             │
│ Run `node node_modules/native-base/ejectTheme.js` to copy over theme config and variables. │
│ Head over to the docs for detailed information on how to make changes to the theme.        │
└────────────────────────────────────────────────────────────────────────────────────────────┘


│ NativeBase theme has been copied at /home/aldian/Documents/private/projects/mokirim/react-native/mokirim/native-base-theme │
│ Here's how to theme your app                                                                                               │
│                                                                                                                            │
│ import getTheme from './react/theme/components';                                                                     │
│ export default class ThemeExample extends Component {                                                                      │
│ render() {                                                                                                                 │
│   return (                                                                                                                 │
│     <StyleProvider  style={getTheme()}>                                                                                    │
│       <Container>                                                                                                          │
│         <Content>                                                                                                          │
│           ...                                                                                                              │
│         </Content>                                                                                                         │
│       </Container>                                                                                                         │
│     </StyleProvider>                                                                                                       │
│   );                                                                                                                       │
│ }                                                                                                                          │
│                                                                                                                            │
│ Head over to the docs (http://docs.nativebase.io/Customize.html#Customize) for detailed information on customization

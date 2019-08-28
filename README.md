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

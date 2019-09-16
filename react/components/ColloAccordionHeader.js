import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Icon, Text,
} from 'native-base';
import themeVars from '../theme/variables/platform';

export default class ColloAccordionHeader extends React.Component {
  render() {
    const {
      expanded,
      expandedIcon,
      expandedIconStyle,
      headerStyle,
      icon,
      iconStyle,
      info,
      onRemove,
    } = this.props;

    const variables = this.context.theme
      ? this.context.theme['@@shoutem.theme/themeStyle'].variables
      : themeVars;

    return (
      <View
        style={[
          // eslint-disable-next-line no-use-before-define
          styles.defaultHeader,
          headerStyle || { backgroundColor: variables.headerStyle },
        , {backgroundColor: 'white', paddingBottom: 0, paddingLeft: 0, paddingRight: 0}]}
      >
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Text style={{flex: 0, color: expanded ? '#FF5A00' : 'black', fontWeight: 'bold', marginRight: 32}}>#{info.index + 1}</Text>
          {expanded ?
            null :
            <Text style={{flex: 0}}>{info.weight || 0} Kg, {info.length || 0}x{info.width || 0}x{info.height || 0} Cm</Text>
          }
        </View>
        <View style={{flex: 0, width: 32, height: 32}}>
        {expanded ?
          <TouchableOpacity onPress={onRemove || (() => {})}>
            <Icon
              style={[
                { fontSize: variables.accordionIconFontSize },
                expandedIcon && expandedIconStyle
                  ? expandedIconStyle
                  : { color: variables.expandedIconStyle }
              , {position: 'relative', bottom: 32, left: 12}]}
              type={"MaterialCommunityIcons"}
              name={
                expandedIcon || 'close-box-outline'
              }
            />
          </TouchableOpacity> :
           <Icon
             style={[
               { fontSize: variables.accordionIconFontSize },
               expanded
                 ? expandedIcon && expandedIconStyle
                   ? expandedIconStyle
                   : { color: variables.expandedIconStyle }
                 : icon && iconStyle
                 ? iconStyle
                 : { color: variables.iconStyle }
             , {position: 'relative', bottom: 32, left: expanded ? 12 : 16}]}
             type={expanded ? "MaterialCommunityIcons" : "Ionicons"}
             name={
               expanded ? expandedIcon || 'close-box-outline' : icon || 'ios-arrow-down'
             }
           />
        }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultHeader: {
    flexDirection: 'row',
    padding: themeVars.accordionContentPadding,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

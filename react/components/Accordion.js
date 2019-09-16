import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Accordion as NBAccordion, Icon, Text,
} from 'native-base';
import themeVars from '../theme/variables/platform';

export class DefaultHeader extends React.Component {
  render() {
    const {
      expanded,
      expandedIcon,
      expandedIconStyle,
      headerStyle,
      icon,
      iconStyle,
      title
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
        ]}
      >
        <View style={{flex: 0}}>
          <Text> {title}</Text>
        </View>
        <View style={{flex: 0, width: 32, height: 32}}>
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
          , {position: 'relative', bottom: 32, left: 10}]}
          type="Ionicons"
          name={
            expanded ? expandedIcon || 'ios-arrow-up' : icon || 'ios-arrow-down'
          }
        />
        </View>
      </View>
    );
  }
}

export class DefaultContent extends React.Component {
  render() {
    const { content, contentStyle } = this.props;
    const variables = this.context.theme
      ? this.context.theme['@@shoutem.theme/themeStyle'].variables
      : themeVars;
    return (
      <Text
        style={[
          { padding: themeVars.accordionContentPadding },
          contentStyle || { backgroundColor: variables.contentStyle }
        ]}
      >
        {content}
      </Text>
    );
  }
}

export default class Accordion extends NBAccordion {
  UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        selected: nextProps.expanded
      });
  }
}

const styles = StyleSheet.create({
  defaultHeader: {
    flexDirection: 'row',
    padding: themeVars.accordionContentPadding,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

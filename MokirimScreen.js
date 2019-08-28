import React from 'react';
import * as RNLocalize from "react-native-localize";
import { setI18nConfig } from "./utils/i18n";


export class MokirimScreen extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig();
  }

  setNavigationHeader() {
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
    this.setNavigationHeader();
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.setNavigationHeader();
    this.forceUpdate();
  };
}

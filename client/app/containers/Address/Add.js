/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddAddress from '../../components/Manager/AddAddress';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    // Initialize form data with empty values including name and phoneNumber
    this.props.addressChange('name', '');
    this.props.addressChange('phoneNumber', '');
    this.props.addressChange('address', '');
    this.props.addressChange('city', '');
    this.props.addressChange('state', '');
    this.props.addressChange('country', '');
    this.props.addressChange('zipCode', '');
    this.props.addressChange('isDefault', false);
  }

  render() {
    const {
      history,
      addressFormData,
      formErrors,
      addressChange,
      addAddress
    } = this.props;

    return (
      <SubPage
        title='Add Address'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddAddress
          addressFormData={addressFormData}
          formErrors={formErrors}
          addressChange={addressChange}
          addAddress={addAddress}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    addressFormData: state.address.addressFormData,
    formErrors: state.address.formErrors
  };
};

export default connect(mapStateToProps, actions)(Add);
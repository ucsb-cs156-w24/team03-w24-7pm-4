import React from 'react';
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from 'fixtures/ucsbOrganizationFixtures';

export default {
    title: 'components/UCSBOrganization/UCSBOrganizationForm',
    component: UCSBOrganizationForm
};

const Template = (args) => {
    return (
        <UCSBOrganizationForm {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    organization: {}
};

export const Filled = Template.bind({});

Filled.args = {
    organization: ucsbOrganizationFixtures.sampleOrganization,
};

import React from 'react';
import { helpRequestFixtures } from 'fixtures/helpRequestFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";
import HelpRequestTable from 'main/components/HelpRequest/HelpRequestTable';

export default {
    title: 'components/HelpRequest/HelpRequestTable',
    component: HelpRequestTable
};

const Template = (args) => {
    return (
        <HelpRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    dates: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    dates: helpRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    dates: helpRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/helprequest', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};


import React from 'react';
import UCSBDiningCommonsMenuItemTable from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable';
import { ucsbDiningCommonsMenuItemFixtures } from 'fixtures/ucsbDiningCommonsMenuItemFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable',
    component: UCSBDiningCommonsMenuItemTable
};

const Template = (args) => {
    return (
        <UCSBDiningCommonsMenuItemTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    ucsbDiningCommonsMenuItem: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    ucsbDiningCommonsMenuItem: ucsbDiningCommonsMenuItemFixtures.threeMenuItems,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    ucsbDiningCommonsMenuItem: ucsbDiningCommonsMenuItemFixtures.threeMenuItems,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/UCSBDiningCommonsMenuItem', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
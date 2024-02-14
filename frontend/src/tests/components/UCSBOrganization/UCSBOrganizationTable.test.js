import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, useNavigate } from "react-router-dom";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures"; // You need to create or adapt this fixture to match your data

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();
  const testIdPrefix = "UCSBOrganizationTable";

  const expectedHeaders = ["Organization Code", "Organization Translation Short", "Organization Translation", "Inactive"];
  const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={[]} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(screen.queryByTestId(`${testIdPrefix}-cell-row-0-col-${field}`)).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers and content for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field, index) => {
      const header = screen.getByTestId(`${testIdPrefix}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
      // You can add more specific checks for each field here if necessary
    });

    // Check for Edit and Delete buttons for admin users
    const editButton = screen.getByTestId(`${testIdPrefix}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testIdPrefix}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  // Add more tests similar to the ones in RestaurantTable for different user roles, interactions like clicking edit/delete buttons, etc.
});

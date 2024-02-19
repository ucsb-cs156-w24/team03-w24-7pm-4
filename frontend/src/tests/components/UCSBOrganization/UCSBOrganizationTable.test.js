import { fireEvent, render, waitFor, screen } from "@testing-library/react";

import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Organization Code", "Organization Translation Short", "Organization Translation", "Inactive"];
    const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
    const testId = "UCSBOrganizationTable";
    
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("CS");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("ECE");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Organization Code", "Organization Translation Short", "Organization Translation", "Inactive"];
    const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
    const testId = "UCSBOrganizationTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("CS");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("ECE");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-orgCode`)).toHaveTextContent("CS"); });

    const editButton = screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsborganization/edit/CS'));

  });
  test("Displays 'Yes' for true and 'No' for false in the Inactive column", () => {
    const currentUser = currentUserFixtures.userOnly;
  
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    const inactiveCell = screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-inactive`);
    expect(inactiveCell).toHaveTextContent("Yes"); 

    const inactiveCell2 = screen.getByTestId(`UCSBOrganizationTable-cell-row-1-col-inactive`);
    expect(inactiveCell2).toHaveTextContent("No"); 
  });
  
});


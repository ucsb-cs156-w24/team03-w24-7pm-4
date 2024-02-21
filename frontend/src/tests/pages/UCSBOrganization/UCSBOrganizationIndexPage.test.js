import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationIndexPage from "main/pages/UCSBOrganization/UCSBOrganizationIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("UCSBOrganizationIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBOrganizationTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("Renders with Create Button for admin user", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Create UCSBOrganization/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBOrganization/);
        expect(button).toHaveAttribute("href", "/ucsborganization/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three dates correctly for regular user", async () => {
        
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").reply(200, ucsbOrganizationFixtures.threeOrganizations);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("CS"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent("Department of Electrical and Computer Engineering");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent("Mathematics");

        // assert that the Create button is not present when user isn't an admin
        expect(screen.queryByText(/Create UCSBOrganization/)).not.toBeInTheDocument();

    });


    test("renders empty table when backend unavailable, user only", async () => {
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsborganizations/all");
        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").reply(200, ucsbOrganizationFixtures.threeOrganizations);
        axiosMock.onDelete("/api/ucsborganizations").reply(200, "UCSBOrganization with id 1 was deleted");
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("CS"); });

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);
        restoreConsole();
        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBOrganization with id 1 was deleted") });

    });

});


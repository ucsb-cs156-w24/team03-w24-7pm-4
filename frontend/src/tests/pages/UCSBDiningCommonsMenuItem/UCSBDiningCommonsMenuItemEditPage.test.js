import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurants", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSB Dining Commons Menu Item");
            expect(screen.queryByTestId("UCSBDiningCommonsMenuItem-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).reply(200, {
                id: 17,
                diningCommonsCode: "Portolla",
                name: "Spicy Tuna Handroll",
                station: "Seafood"
            });
            axiosMock.onPut('/api/ucsbdiningcommonsmenuitems').reply(200, {
                id: 17,
                diningCommonsCode: "Portolla",
                name: "Spicy Tuna Handroll",
                station: "Seafood"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("DiningCommonsMenuItemForm-id");

            const idField = screen.getByTestId("DiningCommonsMenuItemForm-id");
            const diningcommonscodeField = screen.getByTestId("DiningCommonsMenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("DiningCommonsMenuItemForm-name");
            const stationField = screen.getByTestId("DiningCommonsMenuItemForm-station");
            const submitButton = screen.getByTestId("DiningCommonsMenuItemForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(diningcommonscodeField).toBeInTheDocument();
            expect(diningcommonscodeField).toHaveValue("Portolla");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Spicy Tuna Handroll");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Seafood");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(diningcommonscodeField, { target: { value: 'Portolla' } });
            fireEvent.change(nameField, { target: { value: 'Spicy Tuna Handroll W/O Rice' } });
            fireEvent.change(stationField, { target: { value: 'Seafood' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSB Dining Commons Menu Item Updated - id: 17 name: Spicy Tuna Handroll");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: 'Portolla',
                name: 'Spicy Tuna Handroll W/O Rice',
                station: 'Seafood'
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("DiningCommonsMenuItemForm-id");

            const idField = screen.getByTestId("DiningCommonsMenuItemForm-id");
            const diningcommonscodeField = screen.getByTestId("DiningCommonsMenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("DiningCommonsMenuItemForm-name");
            const stationField = screen.getByTestId("DiningCommonsMenuItemForm-station");
            const submitButton = screen.getByTestId("DiningCommonsMenuItemForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(diningcommonscodeField).toBeInTheDocument();
            expect(diningcommonscodeField).toHaveValue("Portolla");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Spicy Tuna Handroll");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Seafood");

            fireEvent.change(diningcommonscodeField, { target: { value: 'Portola Dining Commons' } });
            fireEvent.change(nameField, { target: { value: 'Spicy Tuna Handroll W/O Rice' } });
            fireEvent.change(stationField, { target: { value: 'Seafood' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSB Dining Commons Menu Item Updated - id: 17 name: Spicy Tuna Handroll");
            expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });
        });

       
    });
});
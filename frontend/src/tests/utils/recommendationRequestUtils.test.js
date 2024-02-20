import { onDeleteSuccess, cellToAxiosParamsDelete } from "main/utils/recommendationRequestUtils";
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

describe("RecommendationRequestUtils", () => {

    describe("onDeleteSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            const restoreConsole = mockConsole();
            onDeleteSuccess("abc");
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("cellToAxiosParamsDelete", () => {

        test("It returns the correct params", () => {
            const cell = { row: { values: { id: 17 } } };
            const result = cellToAxiosParamsDelete(cell);
            expect(result).toEqual({
                url: "/api/RecommendationRequest",
                method: "DELETE",
                params: { id: 17 }
            });
        });

    });
});






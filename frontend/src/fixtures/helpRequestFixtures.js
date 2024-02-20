const helpRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "cgaucho@ucsb.edu",
        "teamId": "s22-5pm-3",
        "tableOrBreakoutRoom": "7",
        "requestTime": "2022-04-20T17:35",
        "explanation": "Need help with Swagger-ui",
        "solved": false,
    },
    threeRequests: [
        {
            "id": 2,
            "requesterEmail": "ksd@ucsb.edu",
            "teamId": "s22-4pm-1",
            "tableOrBreakoutRoom": "5",
            "requestTime": "2022-05-11T11:22",
            "explanation": "Fail to build",
            "solved": true,
        },
        {
            "id": 3,
            "requesterEmail": "ldelplaya@ucsb.edu",
            "teamId": "s22-6pm-4",
            "tableOrBreakoutRoom": "11",
            "requestTime": "2022-04-20T22:22",
            "explanation": "Dokku problems",
            "solved": false,
        },
        {
            "id": 4,
            "requesterEmail": "pdg@ucsb.edu",
            "teamId": "s22-6pm-3",
            "tableOrBreakoutRoom": "13",
            "requestTime": "2022-03-10T11:11",
            "explanation": "Merge conflict",
            "solved": false,
        }
    ]
};

export { helpRequestFixtures };
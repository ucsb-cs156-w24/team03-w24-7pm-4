const recommendationRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "student1@ucsb.edu",
        "professorEmail": "professor1@ucsb.edu",
        "explanation": "PhD at Cal Berkeley",
        "dateRequested": "2024-01-20T12:12:12",
        "dateNeeded": "2024-02-21T12:12:13",
        "done": false
    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "student2@ucsb.edu",
            "professorEmail": "professor2@ucsb.edu",
            "explanation": "PhD at Stanford",
            "dateRequested": "2024-02-20T12:12:14",
            "dateNeeded": "2024-03-21T12:12:15",
            "done": true
        },
        {
            "id": 2,
            "requesterEmail": "student3@ucsb.edu",
            "professorEmail": "professor3@ucsb.edu",
            "explanation": "PhD at Carnegie Mellon",
            "dateRequested": "2024-04-20T12:12:16",
            "dateNeeded": "2024-05-21T12:12:17",
            "done": false
        },
        {
            "id": 3,
            "requesterEmail": "student4@ucsb.edu",
            "professorEmail": "professor4@ucsb.edu",
            "explanation": "PhD at MIT",
            "dateRequested": "2024-06-22T12:12:18",
            "dateNeeded": "2024-07-23T12:12:19",
            "done": true
        }
    ]
};

export { recommendationRequestFixtures };
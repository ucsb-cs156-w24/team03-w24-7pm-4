const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "cgaucho@ucsb.edu",
        "professorEmail": "phtcon@ucsb.edu",
        "explanation": "phD in Computer Science at Cal Tech",
        "dateRequested": "2024-01-24T00:00:00",
        "dateNeeded": "2024-02-24T00:00:00",
        "done": true
    },
    threeRecommendationRequests: [
        {
            "id": 1,
            "requesterEmail": "student1@ucsb.edu",
            "professorEmail": "prof1@ucsb.edu",
            "explanation": "phD in Computer Science at MIT",
            "dateRequested": "2024-03-25T00:00:00",
            "dateNeeded": "2024-04-25T00:00:00",
            "done": false
        },
        {
            "id": 2,
            "requesterEmail": "student2@ucsb.edu",
            "professorEmail": "prof2@ucsb.edu",
            "explanation": "phD in Computer Science at Stanford",
            "dateRequested": "2024-05-26T00:00:00",
            "dateNeeded": "2024-06-26T00:00:00",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "student3@ucsb.edu",
            "professorEmail": "prof3@ucsb.edu",
            "explanation": "phD in Computer Science at Carnegie Mellon",
            "dateRequested": "2024-07-27T00:00:00",
            "dateNeeded": "2024-08-27T00:00:00",
            "done": false
        }
    ]
}

export { recommendationRequestFixtures };
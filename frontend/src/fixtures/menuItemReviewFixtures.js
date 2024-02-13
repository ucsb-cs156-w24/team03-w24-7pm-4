const menuItemReviewFixtures = {
    oneReview: {
        "id": 1,
        "itemId": 1,
        "reviewerEmail": "wesley@ucsb.edu",
        "stars": 4,
        "dateReviewed": "2022-01-02T12:00:00",
        "comments": "good soup"
    },
    threeReviews: [
        {
            "id": 1,
            "itemId": 1,
            "reviewerEmail": "wesley@ucla.edu",
            "stars": 1,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "worst thing I have ever tasted"
        },
        {
            "id": 2,
            "itemId": 1,
            "reviewerEmail": "wesley@ucsd.edu",
            "stars": 5,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "best thing I have ever tasted, heaven on earth"
        },
        {
            "id": 3,
            "itemId": 1,
            "reviewerEmail": "wesleytruong@berkeley.edu",
            "stars": 3,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "I can't remember what I ate"
        }
    ]
};


export { menuItemReviewFixtures };
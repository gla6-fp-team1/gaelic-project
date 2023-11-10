Feature: Sending suggestions

    Scenario: Clicking on suggestions
        Given I am on the front page
        When I select suggestion 1
        Then I can see the interaction saved in the database

    Scenario: Clicking on the None option
        Given I am on the front page
        When I select "None of the suggestions are helpful"
        Then I can see the interaction saved in the database

    Scenario: Clicking on the None option
        Given I am on the front page
        When I select "Original sentence is correct"
        Then I can see the interaction saved in the database

    Scenario: Adding user provided options
        Given I am on the front page
        When I add "User suggestion" as my own suggestion
        Then I can see the interaction saved in the database

Feature: Logged in and anonymous users

    Scenario: Anonymous users
        Given I am anonymous
        And I am on the front page

        When I select suggestion 1
        And I select suggestion 1
        And I select suggestion 1
        And I select suggestion 1
        And I select suggestion 1

        Then I get a login prompt

    Scenario: Logged in users
        Given I am logged in as normal user
        And I am on the front page

        When I select suggestion 1
        And I select suggestion 1
        And I select suggestion 1
        And I select suggestion 1
        And I select suggestion 1

        Then I can select suggestion 1

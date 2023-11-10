Feature: Admin features

    Scenario: Anonymous users
        Given I am anonymous
        And I am on the admin page
        Then I don't see the admin features

    Scenario: Normal users
        Given I am logged in as normal user
        And I am on the admin page
        Then I don't see the admin features

    Scenario: Admin users
        Given I am logged in as administrator user
        And I am on the admin page
        Then I see the admin features

    Scenario: Data export
        Given I am logged in as administrator user
        And I am on the admin page
        Then I can download the database as JSON

    Scenario: Data import
        Given I am logged in as administrator user
        And I am on the admin page
        Then I can import data into the database
        And I can see the imported sentences in the database

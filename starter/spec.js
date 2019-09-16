// spec.js

//Constants
const testPage = "http://qaexercise.envalfresco.com/settings";
const testPageTitle = "Welcome - Alfresco ADF Application";
const preferredProvider = "ECM";
const loginPageUrl = "http://qaexercise.envalfresco.com/login";
const usernameLogin= "guest@example.com";
const passwordLogin = "Password";
const homepageUrl = "http://qaexercise.envalfresco.com/home";
const filesUrl = "http://qaexercise.envalfresco.com/files";
const githubUsername = "AleAb25";

var EC = protractor.ExpectedConditions;

//Test page - page elements
var providerField = element(by.css('#adf-provider-selector'));
var providerOptions = element(by.css('.ng-trigger-transformPanel'));
var providerOptionEcm = element(by.css('#mat-option-1'));
var applyButton = element(by.css('#host-button'));

//Login page - page elements
var usernameField = element(by.css('#username'));
var passwordField = element(by.css('#password'));
var signInButton = element(by.css('#login-button'));

//Homepage - page elements
var contentServicesLink = element(by.css('a[href*="/files"]'));
var homeLink = element(by.css('a[href*="/home"]'));

//Files page - page objects
var createNewFolderIcon = element(by.css('button[data-automation-id=create-new-folder]'));
var newFolderDialogBox = element(by.css('#mat-dialog-title-0'));
var gitHubUsernameField = element(by.css('#adf-folder-name-input'));
var createButton = element(by.css('#adf-folder-create-button'));
var newFolderName = element(by.css('span[title=' + githubUsername + ']'));
var threeDots = element(by.css('#action_menu_right_0'));
var folderMenuOptions = element(by.css('button[data-automation-id="Action for \'custom\' node"]'));
var deleteFolderOptionButton = element(by.css('button[data-automation-id="DOCUMENT_LIST.ACTIONS.FOLDER.DELETE"]'));
var errorMessage =element(by.css('snack-bar-container[role*=\'alert\']'));
var deleteConfirmationAlert = element(by.css('.mat-snack-bar-container'));

var anotherTry = element(by.css('div[aria-live="assertive"]'));
var cancelFolderButton = element(by.css('#adf-folder-cancel-button'));

describe('ADF Demo App', function() {

    describe('Homepage ADF Demo App', function(){
        it('should display the test page', function() {
            //The test application page should open and to verify that the correct page is loaded,
            // a verification with the page title is done
            browser.get(testPage);
            browser.getTitle().then(function (text) {
                expect(text).toContain(testPageTitle);
            })
        });
        it('should choose the ECM provider', function(){
            //This method clicks on Providers field and verifies that the provider options are displayed
            providerField.click().then(function (){
                providerOptions.getText().then(function(text){
                    expect((providerOptions).isDisplayed()).toBe(true);
                });

            });
            // The preferred provider - ECM - is chosen
            providerOptionEcm.click().then(function () {
                providerField.getText().then(function (text) {
                    expect(text).toEqual(preferredProvider);
                })
            });

            // The change is saved and to verify that, a confirmation assert is done with the new URL
            applyButton.click().then(function(){
                browser.getCurrentUrl().then(function (text){
                    expect(text).toEqual(loginPageUrl);
                });
            })

        })
    });

    describe('Login page is displayed', function(){
        it('should check that the Login page is displayed', function(){
            //Check if the login page is displayed - verifying the page Url
            browser.getCurrentUrl().then(function (text){
                expect(text).toEqual(loginPageUrl);
            });
        });
        it('should insert username & password and log in', function () {
           // Set the username & password
            usernameField.clear().then(function(){
                usernameField.sendKeys(usernameLogin);
            });
            passwordField.clear().then(function(){
                passwordField.sendKeys(passwordLogin);
            });
           // Press login button and verify that login is successful verifying the Url
            // of the new page displayed
            signInButton.click().then(function(){
                browser.getCurrentUrl().then(function (text){
                    expect(text).toEqual(homepageUrl);
                });
            })

        })
    });

    describe('Logged in Homepage', function () {
        it('should display the logged in home', function () {
            //Check if the homepage is displayed - verifying the page Url
            browser.getCurrentUrl().then(function (text){
                expect(text).toEqual(homepageUrl);
            });
        });
        it('should click on Content Services and go to files page', function(){
            //go to the Files page and confirming that with the Url
            contentServicesLink.click().then(function(){
                browser.getCurrentUrl().then(function (text){
                    expect(text).toEqual(filesUrl);
                });
            })
        })
    });

    describe('Files page', function(){
        it('should display the Files page', function () {
            //Check if the Files page is displayed - verifying the page Url
            browser.getCurrentUrl().then(function (text){
                expect(text).toEqual(filesUrl);
            });
        });
        it('should pop-up a new folder dialog box', function(){
            //Clicks on "create new folder" icon and checks that a dialog box is displayed
            createNewFolderIcon.click().then(function(){
                browser.wait(EC.presenceOf(newFolderDialogBox), 5000).then(function(){
                    expect((newFolderDialogBox).isDisplayed()).toBe(true);
                })
            })
        });
        it('should create a new folder', function () {
            //Set the name for new folder
            browser.wait(EC.elementToBeClickable((gitHubUsernameField), 5000)).then(function(){
                gitHubUsernameField.click().then(function(){
                    gitHubUsernameField.sendKeys(githubUsername);
                });
            });
            //Create the folder and verify that the dialog box is not displayed anymore
            createButton.click().then(function(){
                browser.wait(EC.invisibilityOf(newFolderDialogBox), 5000);
                expect((newFolderDialogBox).isPresent()).toBe(false);
            })
        });
        it('should displayed my new abc folder', function(){
            //Checks if the new folder is created
            expect(newFolderName.isDisplayed()).toBe(true);
        });

         it('should check for a duplicate message and close the "Create new folder" dialog window', function(){
           // Click on "Create new folder" icon
            createNewFolderIcon.click();
            //Set the name as before
            gitHubUsernameField.sendKeys(githubUsername);
            //Try to create the folder and Verify that duplicate message error is displayed
            createButton.click();
            expect(errorMessage.isDisplayed()).toBe(true);
            errorMessage.getText().then(function (text) {
                expect(text).toContain('There\'s already a folder with this name. Try a different name.');

            });
            cancelFolderButton.click();
            browser.wait(EC.invisibilityOf(newFolderDialogBox), 5000);
            expect((newFolderDialogBox).isPresent()).toBe(false);

        });

        it('should delete my new folder', function(){
            //Selects a specified folder and deletes it
            newFolderName.click().then(function(){
                threeDots.click().then(function(){
                    expect(folderMenuOptions.isDisplayed()).toBe(true).then(function(){
                        deleteFolderOptionButton.click().then(function () {
                            browser.wait(EC.visibilityOf(anotherTry), 5000).then(function () {
                                expect((anotherTry).isDisplayed()).toBe(true);
                                anotherTry.getText().then(function (text) {
                                    expect(text).toContain('deleted');
                                    console.log("Yupiii - it containd deleted")
                                })
                            })
                        });


                    })
                })

            })
        })


    })

});

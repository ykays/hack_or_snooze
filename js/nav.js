"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navAddStory.show();
  $navFavorites.show();
  $navMyStories.show();
}

// Show add new story form on click on 'submit'
function navAddNewStory(e) {
  console.debug("navAddNewStory");
  hidePageComponents();
  $submitStoryForm.show();
  $submittedStories.show();
}

//show favorite stories section
$body.on("click", "#nav-submit", navAddNewStory);

//show my stories section
function navMyStories() {
  console.debug("navMyStories");
  hidePageComponents();
  $myStories.show();
  putMyStoriesOnMyStories();
}

$body.on("click", "#nav-my-stories", navMyStories);

//show my favorite stories
function navMyFavorites() {
  console.debug("navMyFavorites");
  hidePageComponents();
  $favoriteList.show();
  putMyFavoriteStories();
}

$body.on("click", "#nav-favorites", navMyFavorites);

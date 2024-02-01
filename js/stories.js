"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  if (currentUser === undefined) {
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else
    return $(`
    <li id="${story.storyId}">
      <span class='star star-unclicked'></span>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    $allStoriesList.append($story);
    markExistingFavorites(story);
  }

  $allStoriesList.show();
}

//add new story
async function submitNewStory(e) {
  let author = $("#author").val();
  let title = $("#title").val();
  let url = $("#url").val();
  const story = await storyList.addStory(currentUser, { author, title, url });
  const submittedStory = generateStoryMarkup(story);
  $submittedStories.append(submittedStory);
  $("#author").val("");
  $("#title").val("");
  $("#url").val("");
}

$submitStoryForm.on("submit", function (e) {
  e.preventDefault();
  submitNewStory(e);
});

//mark unmark user's fav story
let favUser = User.markFavorite;
$(".stories-list").on("click", ".star", function (e) {
  e.preventDefault();
  if (!currentUser) return;
  favUser(e);
});

async function putMyStoriesOnMyStories() {
  $("p").remove();
  $myStories.empty();
  const fav = await User.reloadUser();
  const userStories = currentUser.ownStories;
  if (userStories.length === 0) {
    $myStories.append("<p>No stories added by the user yet!</p>");
  }
  for (let story of storyList.stories) {
    if (currentUser.username === story.username) {
      const $story = generateStoryMarkup(story);
      $myStories.append($story);
      markExistingFavorites(story);
    }
  }
  $myStories.show();
  $("#my-stories-list > li").prepend(
    "<span><button id='remove'>X</button></span>"
  );
}

async function putMyFavoriteStories() {
  $("p").remove();
  $favoriteList.empty();
  const fav = await User.reloadUser();
  const myFavorites = currentUser.favorites;
  if (myFavorites.length === 0) {
    $favoriteList.append("<p>No favorites added!</p>");
  }
  for (let story of myFavorites) {
    const $story = generateStoryMarkup(story);
    $favoriteList.append($story);
    markExistingFavorites(story);
  }
}

function markExistingFavorites(story) {
  if (currentUser === undefined) return;
  for (let favorite of currentUser.favorites) {
    if (favorite.storyId === story.storyId) {
      $(`li#${favorite.storyId}>span`).toggleClass("star-clicked");
      $(`li#${favorite.storyId}>span`).toggleClass("star-unclicked");
    }
  }
}

async function removeStory(e) {
  const deletedStory = e.target.parentElement.parentElement;
  const token = currentUser.loginToken;
  const storyId = e.target.parentElement.parentElement.attributes.id.value;
  deletedStory.remove();
  const deleteRes = await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    params: { token },
  });
  storyList = await StoryList.getStories();
}
$myStories.on("click", "#remove", function (e) {
  e.preventDefault();
  removeStory(e);
});

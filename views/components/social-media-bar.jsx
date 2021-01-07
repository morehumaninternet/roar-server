const React = require('react')
const { 
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  LinkedinShareButton, LinkedinIcon,
  RedditShareButton, RedditIcon,
  TwitterShareButton, TwitterIcon } = require('react-share');

const RoarURL = 'https://roar.morehumaninternet.org';
const shortSummary = 'See something broken online? Tell the world and get help with Roar from More Human Internet.';
const longSummary = `Roar is a free, non-profit web extension that automatically captures a snapshot of any online
  issue and addresses a tweet to the site's maintainer. Turn a tweet into a Roar as experts and maintainers see the 
  issue and offer solutions.`;
const title = 'Roar!';

module.exports = function SocialMediaBar(props) {
  return (
    <div className="social-media-bar">
      <FacebookShareButton
        url={RoarURL}
        quote={shortSummary}
      >
        <FacebookIcon size={48} />
      </FacebookShareButton>

      <TwitterShareButton
        url={RoarURL}
        hashtag="#roar"
      >
        <TwitterIcon size={48} />
      </TwitterShareButton>

      <LinkedinShareButton
        url={RoarURL}
        summary={longSummary}
      >
        <LinkedinIcon size={48} />
      </LinkedinShareButton>

      <RedditShareButton
        url={RoarURL}
        title={title}
      >
        <RedditIcon size={48} />
      </RedditShareButton>

      <EmailShareButton
        url={RoarURL}
        subject={title}
      >
        <EmailIcon size={48} />
      </EmailShareButton>
    </div>
  );
}
const React = require('react')
const Layout = require('./shared/layout')
const stepIcons = require('./components/step-icons')
const { SlackIcon } = require('./components/slack-icon')


function IntroductionSection() {
  return (
    <section className="introduction-section full-width">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero__header">Powered by you</h1>
          <p className="hero__text">See something broken online?<br />Tell the world and get help with Roar from More Human Internet.</p>
          <a className="mhi-button btn btn--download" rel="noopener noreferrer" href="https://chrome.google.com/webstore/detail/roar/jfcmnmgckhjcflmljjgjjilmjhbgdfkc?hl=en">Free Download</a>
          <button className="mhi-button btn btn--watch">Watch Video</button>
        </div>
        <img className="hero__gif" src="demo_video.gif" />
      </div>
    </section>
  )
}

function Modal() {
  return (
    <section className="modal modal--hidden">
      <div className="modal__content">
        <div className="modal__video">
          <iframe src="https://www.youtube.com/embed/QH2-TGUlwu4" width="560" height="315" frameBorder="0"></iframe>
        </div>
      </div>
    </section>
  )
}

function Step(props) {
  return (
    <div className="step">
      <div className="step-explanation">
        {props.icon}
        <h3>{props.title}</h3>
      </div>
      <p>{props.description}</p>
    </div>
  )
}

function StepsSection() {
  return (
    <section className="steps-section full-width">
      <h1 className="steps-title">Bring attention to problems on the web</h1>
      <div className="steps">
        <Step
          title="1. Find an issue"
          description="Search is broken? Link goes nowhere? Image won’t load? Let’s get this fixed!"
          icon={stepIcons.FindAnIssue}
        />
        <Step
          title="2. Take a screenshot"
          description="Open the Roar! extension to automatically capture a screenshot of the issue."
          icon={stepIcons.TakeAScreenshot}
        />
        <Step
          title="3. Tweet about it"
          description="Explain the problem and send a tweet directly to the site’s maintainers, autofilled by Roar."
          icon={stepIcons.TweetAboutIt}
        />
        <Step
          title="4. Get it fixed"
          description="Celebrate as maintainters and experts come to your aid with solutions and support."
          icon={stepIcons.GetItFixed}
        />
      </div>
    </section>
  )
}

function AccordionItem(props) {
  return (
    <div className="accordion_item">
      <div className="accordion_header">
        <svg className="arrow"  viewBox="0 0 22 29">
          <path d="M0 28.6029V0.20105L21.3088 14.402L0 28.6029Z" fill="black"/>
        </svg>
        <h3>
          {props.header}
        </h3>
      </div>
      <div className="accordion__text">
        <p>{props.description}</p>
      </div>
    </div>
  )
}

function Accordion() {
  return (
    <section className="accordion">
      <AccordionItem
        header="What is Roar?"
        description="Roar is a free, non-profit web extension that automatically captures a snapshot of any online issue and addresses a tweet to the site's maintainer. Turn a tweet into a Roar as experts and maintainers see the issue and offer solutions."
      />
      <AccordionItem
        header="Why Roar?"
        description="More Human Internet is a community of digital activists working to make the internet a more civil and transparent place, and Roar is our first product. We want to make the simple act of asking for help a more seamless process, and we want to encourage human solutions."
      />
      <AccordionItem
        header="Why Twitter?"
        description="Twitter is where the people are! Issues posted on Twitter get high visibility and rapid solutions from maintainers."
      />
      <AccordionItem
        header="What's next?"
        description="The extension is just the beginning. As more people use Roar to find solutions online, we hope to build a network of human-centric web citizens identifying, documenting and solving issues online. We like to think of this group as the internet's helpdesk, and with more reported issues, that group can start to identify similar issues and surface solutions to further streamline the process of getting an answer."
      />
      <AccordionItem
        header="I'm a bit of a digital activist myself..."
        description="We're building a community of technologists creating a more human internet. Roar is this group's first product, and your idea could be next! Join our Slack channel to get involved or stay in the loop by joining our mailing list."
      />
    </section>
  )
}

function GetUpdatesSection() {
  return (
    <section className="get-updates">
      <a className="mhi-button slack" target="_blank" rel="noopener noreferrer" href="https://join.slack.com/t/morehumaninternet/shared_invite/zt-kkbdraz8-XT5~cViVQTJlzaklWgj7Dg">
          {SlackIcon}
          <p className="slack__text">Join our Slack channel</p>
      </a>
      <div className="newsletter">
        <form className="newsletter__form">
          <input className="newsletter__email" type="email" placeholder="email" required/>
          <button className="mhi-button newsletter__submit" type="submit">Get updates</button>
        </form>
        <p className="newsletter__promise">* We hate spam and won’t ever share your email with anyone else</p>
        <p className="newsletter__result hide"></p>
      </div>
    </section>
  )
}

module.exports = function Index() {
  return (
    <Layout stylesheets="index.css" scripts="index.js">
      <IntroductionSection />
      <Modal />
      <StepsSection />
      <Accordion />
      <GetUpdatesSection />
    </Layout>
  )
}

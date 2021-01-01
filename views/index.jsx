const React = require('react')
const Layout = require('./shared/layout')
const Header = require('./shared/header')


function IntroductionSection() {
  return (
    <section className="introduction-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero__header">Powered by you</h1>
          <p className="hero__text">See something broken online?<br />Tell the world and get help with Roar from More Human Internet.</p>
          <a className="btn btn--download" target="_blank" rel="noopener noreferrer" href="https://morehumaninternet.org">Free Download</a>
          <button className="btn btn--watch">Watch Video</button>
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
          <iframe src="https://www.youtube.com/embed/QH2-TGUlwu4" width="560" height="315" frameborder="0"></iframe>
        </div>
      </div>
    </section>
  )
}

function StepsSection() {
  return (
    <section className="steps-section">
      <h1 className="steps-title">Bring attention to problems on the web</h1>
      <div className="steps">
        <div className="step">
          <div className="step-explanation">
            <svg width="60" height="60" viewBox="0 0 418 355" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38 0C17.005 0 0 15.8862 0 35.5V248.5C0 268.114 17.005 284 38 284H171V319.5H133V355H285V319.5H247V284H380C400.995 284 418 268.114 418 248.5V35.5C418 15.8862 400.995 0 380 0H38ZM38 35.5H380V248.5H38V35.5ZM190 71V159.75H228V71H190ZM190 177.5V213H228V177.5H190Z" fill="#FB945B"/>
              </svg>
              <h3>1. Find an issue</h3>
          </div>
          <p>Search is broken? Link goes nowhere? Image won’t load? Let’s get this fixed!</p>
        </div>
        <div className="step">
          <div className="step-explanation">
            <svg width="60" height="60" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.62914 0.34021C1.62404 0.34021 0 1.96425 0 3.96935H3.62914V0.34021ZM7.25828 0.34021V3.96935H10.8874V0.34021H7.25828ZM14.5166 0.34021V3.96935H18.1457V0.34021H14.5166ZM21.7748 0.34021V3.96935H25.404V0.34021H21.7748ZM29.0331 0.34021V3.96935H32.6623C32.6623 1.96425 31.0382 0.34021 29.0331 0.34021ZM0 7.59849V11.2276H3.62914V7.59849H0ZM29.0331 7.59849V11.2276H32.6623V7.59849H29.0331ZM16.3311 11.2276L13.9141 14.8568H9.98013C8.47767 14.8568 7.25828 16.0762 7.25828 17.5786V30.2806C7.25828 31.7831 8.47767 33.0025 9.98013 33.0025H29.9404C31.4429 33.0025 32.6623 31.7831 32.6623 30.2806V17.5786C32.6623 16.0762 31.4429 14.8568 29.9404 14.8568H26.0065L23.5894 11.2276H16.3311ZM0 14.8568V18.4859H3.62914V14.8568H0ZM18.2733 14.8568H21.6472L22.9905 16.8698L24.0679 18.4859H26.0065H29.0331V29.3733H10.8874V18.4859H13.9141H15.8527L16.9301 16.8698L18.2733 14.8568ZM19.9603 20.3005C18.9978 20.3005 18.0747 20.6828 17.3941 21.3634C16.7135 22.044 16.3311 22.9671 16.3311 23.9296C16.3311 24.8921 16.7135 25.8152 17.3941 26.4958C18.0747 27.1764 18.9978 27.5588 19.9603 27.5588C20.9228 27.5588 21.8459 27.1764 22.5265 26.4958C23.207 25.8152 23.5894 24.8921 23.5894 23.9296C23.5894 22.9671 23.207 22.044 22.5265 21.3634C21.8459 20.6828 20.9228 20.3005 19.9603 20.3005ZM0 22.115V25.7442H3.62914V22.115H0ZM0 29.3733C0 31.3784 1.62404 33.0025 3.62914 33.0025V29.3733H0Z" fill="#fa759e"/>
              </svg>
              <h3>2. Take a screenshot</h3>
          </div>
          <p>Open the Roar! extension to automatically capture a screenshot of the issue.</p>
        </div>
        <div className="step">
          <div className="step-explanation">
            <svg width="60" height="60" viewBox="0 0 125 102" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.31 101.569C86.48 101.569 112.28 62.489 112.28 28.599C112.28 27.489 112.28 26.384 112.205 25.284C117.224 21.6536 121.557 17.1584 125 12.009C120.319 14.083 115.354 15.4431 110.27 16.044C115.624 12.8389 119.631 7.79786 121.545 1.859C116.511 4.84628 111.003 6.95156 105.26 8.084C101.393 3.97242 96.2793 1.24984 90.7094 0.337566C85.1394 -0.574709 79.4241 0.374182 74.4477 3.0374C69.4714 5.70062 65.5116 9.9297 63.1809 15.0702C60.8503 20.2107 60.2789 25.976 61.555 31.474C51.3588 30.9628 41.384 28.3132 32.2782 23.697C23.1724 19.0807 15.1392 12.6012 8.7 4.679C5.42046 10.3248 4.416 17.0083 5.89114 23.3687C7.36629 29.7291 11.2101 35.2881 16.64 38.914C12.5587 38.793 8.5664 37.6921 5 35.704C5 35.809 5 35.919 5 36.029C5.00162 41.9501 7.05131 47.6884 10.8014 52.2705C14.5515 56.8526 19.7712 59.9966 25.575 61.169C21.7993 62.1987 17.8379 62.3492 13.995 61.609C15.6338 66.7048 18.8243 71.1611 23.1204 74.3544C27.4164 77.5477 32.6031 79.3185 37.955 79.419C28.8737 86.5562 17.6553 90.4306 6.105 90.419C4.06452 90.4151 2.02602 90.2915 0 90.049C11.7282 97.5754 25.3746 101.568 39.31 101.549" fill="#1DA1F2"/>
              </svg>
              <h3>3. Tweet about it</h3>
          </div>
          <p>Explain the problem and send a tweet directly to the site’s maintainers, autofilled by Roar.</p>
        </div>
        <div className="step">
          <div className="step-explanation">
            <svg width="60" height="60" viewBox="0 0 381 341" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M211.452 2.3936e-07C203.138 -0.000992226 194.82 3.08433 188.48 9.27335L111.497 84.5767C113.201 85.3786 114.875 86.1815 116.506 87.1819C122.269 90.6992 127.011 94.801 130.98 99.2155L205.697 26.1298C208.863 23.0253 214.025 23.0257 217.175 26.1142C220.332 29.2187 220.332 34.2295 217.191 37.326L156.901 96.3002C152.144 100.953 152.144 108.488 156.901 113.141C161.657 117.794 169.361 117.794 174.117 113.141L182.979 104.473L234.392 54.1979L234.423 54.1669L251.608 37.357C254.782 34.2526 259.929 34.253 263.086 37.3415C263.954 38.1831 264.535 39.193 264.925 40.2569C273.326 39.4312 281.807 40.8968 289.656 44.692C290.176 35.99 287.088 27.1382 280.303 20.5006C269.288 9.72641 252.26 8.36487 239.671 16.3602C238.242 13.8433 236.575 11.4091 234.392 9.27335C228.068 3.0883 219.766 0.000992705 211.452 2.3936e-07ZM32.6106 39.6831C26.4073 39.7139 20.347 41.5626 14.9817 45.2347C3.42327 53.1665 -2.26819 68.0763 0.840575 82.3281C6.20584 106.965 8.54757 122.484 8.45016 167.82C8.4177 181.849 16.0133 199.874 26.1107 209.751L49.8749 233.012C49.3716 229.741 49.0265 226.495 49.0346 223.367C49.059 213.656 48.968 205.447 48.7651 198.214L43.3274 192.91C37.7998 187.496 32.7846 175.575 32.8008 167.882C32.8982 120.458 30.2691 103.13 24.6522 77.3658C23.3941 71.5857 25.9939 66.783 28.9485 64.7584C31.6108 62.9402 34.6594 63.0946 38.2227 65.2701C49.148 71.9395 51.7599 81.3747 53.854 95.5868C56.4271 92.7127 59.2319 90.0408 62.4624 87.8177C66.6913 84.9197 71.2531 82.8261 75.9853 81.4287C73.0145 68.3361 67.0534 54.7982 51.0956 45.0641C45.154 41.4357 38.8139 39.6523 32.6106 39.6831ZM268.27 55.6246C259.936 55.6244 251.606 58.7039 245.314 64.8514C245.309 64.8514 245.304 64.8514 245.299 64.8514L139.081 168.75C137.238 162.839 135.994 155.942 134.722 147.257C132.512 132.172 127.548 112.629 107.93 100.658C107.924 100.653 107.919 100.647 107.914 100.642C94.8176 92.6561 78.7637 94.6499 69.0574 102.922C59.3511 111.194 54.7329 124.469 57.6588 137.906C63.0131 162.486 65.3649 177.352 65.2684 223.398C65.2337 238.76 71.7857 254.445 82.929 265.345L136.814 318.054C168.092 348.649 219.19 348.649 250.467 318.054L371.57 199.594C384.147 187.292 384.14 166.993 371.57 154.685C371.57 154.68 371.57 154.675 371.57 154.67C368.713 151.875 365.394 149.805 361.884 148.281C365.811 137.128 363.387 124.22 354.369 115.39C354.364 115.384 354.359 115.379 354.353 115.374C351.496 112.579 348.177 110.51 344.667 108.985C348.594 97.828 346.17 84.9088 337.153 76.0787C337.147 76.0787 337.142 76.0787 337.137 76.0787C330.848 69.9276 322.515 66.8521 314.181 66.8518C308 66.8517 301.835 68.5707 296.489 71.9537C295.065 69.4209 293.406 66.9861 291.226 64.8514C284.937 58.7004 276.604 55.6248 268.27 55.6246ZM268.27 79.2887C270.325 79.2896 272.375 80.0942 274.009 81.6923C277.284 84.8988 277.276 89.7233 274.009 92.9196L219.474 146.249V146.265L213.735 151.878C212.566 152.976 211.633 154.29 210.991 155.745C210.348 157.199 210.008 158.764 209.992 160.349C209.976 161.933 210.282 163.505 210.895 164.972C211.507 166.439 212.412 167.772 213.558 168.892C214.703 170.013 216.066 170.898 217.565 171.497C219.065 172.096 220.672 172.396 222.292 172.38C223.912 172.364 225.512 172.032 226.999 171.403C228.486 170.775 229.829 169.862 230.951 168.719L236.69 163.106L291.226 109.776C291.25 109.752 291.265 109.722 291.289 109.698L308.442 92.9196C311.72 89.7164 316.653 89.7233 319.92 92.9196C323.195 96.1261 323.188 100.951 319.92 104.147L308.458 115.359L308.442 115.374C308.432 115.384 308.421 115.395 308.411 115.405L242.445 179.946C241.277 181.044 240.344 182.358 239.701 183.813C239.058 185.267 238.719 186.833 238.702 188.417C238.686 190.001 238.993 191.573 239.605 193.04C240.217 194.507 241.123 195.84 242.268 196.96C243.414 198.081 244.776 198.966 246.276 199.565C247.775 200.164 249.382 200.464 251.002 200.448C252.622 200.432 254.222 200.1 255.709 199.471C257.196 198.843 258.54 197.93 259.662 196.787L325.294 132.572C325.418 132.46 325.54 132.347 325.659 132.231C328.937 129.027 333.869 129.019 337.137 132.215C340.411 135.422 340.404 140.262 337.137 143.458L325.818 154.53C325.763 154.583 325.697 154.617 325.643 154.67L325.659 154.685L265.401 213.628C264.232 214.726 263.299 216.04 262.656 217.495C262.014 218.949 261.674 220.514 261.658 222.099C261.641 223.683 261.948 225.255 262.56 226.722C263.173 228.189 264.078 229.522 265.224 230.642C266.369 231.763 267.731 232.648 269.231 233.247C270.731 233.846 272.338 234.146 273.958 234.13C275.577 234.114 277.178 233.782 278.665 233.153C280.152 232.525 281.495 231.612 282.617 230.469L342.86 171.526C346.134 168.326 351.07 168.326 354.338 171.51C357.612 174.717 357.621 179.557 354.353 182.753L233.25 301.213C211.28 322.703 176.017 322.703 154.047 301.213L100.146 248.504C95.7045 244.16 89.6051 229.646 89.6191 223.46C89.7174 176.548 86.9604 158.146 81.4705 132.944C80.3543 127.818 82.4199 123.123 85.0533 120.879C87.6868 118.635 89.6226 117.56 95.0409 120.864C106.819 128.051 108.598 136.908 110.609 150.638C112.62 164.367 113.198 182.665 127.635 196.787C128.766 197.895 130.109 198.774 131.588 199.374C133.066 199.973 134.651 200.282 136.252 200.282C137.852 200.282 139.437 199.973 140.915 199.374C142.394 198.774 143.737 197.895 144.868 196.787L262.515 81.6923C264.154 80.0907 266.215 79.2878 268.27 79.2887Z" fill="#FADE60"/>
              </svg>
              <h3>4. Get it fixed</h3>
          </div>
          <p>Celebrate as maintainters and experts come to your aid with solutions and support.</p>
        </div>
      </div>
    </section>
  )
}

function AccordionItem(props) {
  return (
    <div className="acc-item">
      <svg width="20" height="20" viewBox="0 0 22 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 28.6029V0.20105L21.3088 14.402L0 28.6029Z" fill="black"/>
      </svg>
      <h3 className="acc-header">
        {props.header}
      </h3>
      <div className="panel">
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

module.exports = function Index() {
  return (
    <Layout
      stylesheets="index.css"
      scripts="index.js"
    >
      <IntroductionSection />
      <Modal />
      <StepsSection />
      <Accordion />
    </Layout>
  )
}
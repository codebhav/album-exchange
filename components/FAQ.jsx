import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export function FAQItem({ question, answer, id }) {
	const [isOpen, setIsOpen] = useState(false);
	const faqId = id || `faq-${Math.random().toString(36).substring(2, 9)}`;
	const contentId = `${faqId}-content`;

	return (
		<div className="faq-item">
			<h3>
				<button
					className="faq-question"
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					aria-controls={contentId}
					id={faqId}
				>
					<span>{question}</span>
					<span className="icon-container" aria-hidden="true">
						{isOpen ? <IoChevronUp /> : <IoChevronDown />}
					</span>
				</button>
			</h3>

			<div
				id={contentId}
				role="region"
				aria-labelledby={faqId}
				className="faq-answer"
				hidden={!isOpen}
			>
				{isOpen && answer}
			</div>
		</div>
	);
}

export function FAQ() {
	return (
		<section className="faq-container" aria-labelledby="faq-heading">
			<h2 className="section-title" id="faq-heading">
				FAQ
			</h2>

			<div className="faq-list">
				<FAQItem
					id="faq-what"
					question="what is album exchange?"
					answer={
						<p>
							it's something me and my friend started a few years
							ago, where we'd send each other an album every week.
							i have now turned that into a personal project to
							justify the purchase of this domain. each week, i'll
							feature an album i'm obsessing over as my "weekly
							pick," and y'all can do the same too!
						</p>
					}
				/>

				<FAQItem
					id="faq-how"
					question="how does it work?"
					answer={
						<>
							<p>the process is simple:</p>
							<ol>
								<li>
									you submit an album you love using the form
								</li>
								<li>
									your submission automatically becomes a
									playlist on my spotify account and gets
									added to the gallery
								</li>
								<li>
									i'll check out the albums people recommend
									throughout the week
								</li>
								<li>
									each week, i'll share an album i'm currently
									enjoying as the "weekly pick"
								</li>
							</ol>
							<p>
								You can submit once per week (resets every
								monday at midnight UTC). if you submit
								anonymously, your profile link won't be shared,
								but i'll still use your nickname for the
								playlist name.
							</p>
						</>
					}
				/>

				<FAQItem
					id="faq-data"
					question="what data do you store?"
					answer={
						<>
							<p>
								i'm committed to your privacy! here's what i
								store:
							</p>
							<ul>
								<li>
									a cryptographically hashed version of your
									browser fingerprint and IP address (to limit
									submissions to once per week)
								</li>
								<li>
									your nickname (used for creating the
									playlist)
								</li>
								<li>
									your spotify profile URL (only if you choose
									not to be anonymous)
								</li>
								<li>the album details you submitted</li>
							</ul>
							<p>
								your data is securely stored in firebase and is
								only used for this project.{" "}
								<strong>
									both IP addresses and browser fingerprints
									are one-way hashed with a salt, meaning they
									can't be reversed to identify you.
								</strong>{" "}
								obviously, i don't share your information with
								third parties.
							</p>
						</>
					}
				/>

				<FAQItem
					id="faq-nickname"
					question="why do you need my nickname?"
					answer={
						<p>
							i'd like to know who recommended an album, it
							doesn't have to be your real name. let's say your
							nickname is blood and you recommend the album red, a
							playlist called "blood-red" will be created on my
							spotify. but please don't call yourself "blood" for
							the love of mother, t swift.
						</p>
					}
				/>

				<FAQItem
					id="faq-weekly"
					question="how do you pick the weekly album?"
					answer={<p>vibes.</p>}
				/>

				<FAQItem
					id="faq-past"
					question="can I see past recommendations?"
					answer={
						<p>
							yup! all community recommendations are available in
							the "gallery" section accessible from the navigation
							bar at the top of the page. this gallery shows all
							submitted albums along with profile links of who
							recommended them (unless they chose to remain
							anonymous). here's a{" "}
							<a href="https://bhav.fun/albums">quick link</a>{" "}
							because i know there's at least one of you who's
							lazy to scroll to the top
						</p>
					}
				/>

				<FAQItem
					id="faq-guidelines"
					question="do you have any submission guidelines?"
					answer={
						<>
							<p>yeah, just a few simple ones:</p>
							<ul>
								<li>only submit albums available on spotify</li>
								<li>
									your nickname should be 2-30 characters
									(letters, numbers, and spaces only)
								</li>
								<li>one submission per week per person</li>
								<li>
									feel free to recommend any genre / language
								</li>
							</ul>
						</>
					}
				/>

				<FAQItem
					id="faq-tracking"
					question="do you track me across devices?"
					answer={
						<p>
							no lmao. the app uses a combination of IP address
							and browser fingerprinting to identify returning
							visitors, but only for the purpose of enforcing the
							"one submission per week" rule. it just means your
							submissions are typically tied to both your device
							and network. if you use a different browser or
							network (like switching from home WiFi to mobile
							data), you might be able to submit again, but if you
							are that deperate to sneak multiple albums, just{" "}
							<a
								href="https://whybhav.in/contact"
								target="_blank"
							>
								text
							</a>{" "}
							me the link bro.
						</p>
					}
				/>

				<FAQItem
					id="faq-creator"
					question="who made this?"
					answer={
						<p>
							bhav :) here's a hyperlink to my{" "}
							<a href="https://whybhav.in/" target="_blank">
								personal website
							</a>{" "}
							and{" "}
							<a
								href="https://open.spotify.com/user/0rs4afffl5o4avb4ilxbot2ty"
								target="_blank"
							>
								spotify
							</a>{" "}
							if you're{" "}
							<span
								style={{
									textDecoration: "line-through",
									textDecorationColor:
										"var(--color-terracotta)",
									textDecorationThickness: "2px",
									fontWeight: "600",
								}}
							>
								a nerd
							</span>{" "}
							curious about the technology behind it, it's built
							with nextjs, react, and firebase, and the code is
							available on{" "}
							<a
								href="https://github.com/codebhav/album-exchange"
								target="_blank"
							>
								github
							</a>
							, released under the MIT license.
						</p>
					}
				/>
			</div>
		</section>
	);
}

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
							it's simple way to share and discover music. Each
							week, I feature an album I'm loving as my "weekly
							pick," and you can share your favorites too. it
							started as a weekly tradition with a friend and
							evolved into this little project.
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
								<li>submit an album you love using the form</li>
								<li>
									your submission becomes a playlist on my
									Spotify and appears in the gallery
								</li>
								<li>
									browse the <a href="/albums">gallery</a> to
									discover albums others have recommended
								</li>
								<li>
									check back each week to see my featured
									weekly pick
								</li>
							</ol>
							<p>
								you can submit once weekly (resets every Monday
								at midnight UTC).
							</p>
						</>
					}
				/>

				<FAQItem
					id="faq-guidelines"
					question="what are the submission rules?"
					answer={
						<>
							<ul>
								<li>only submit albums available on Spotify</li>
								<li>
									your nickname should be 2-30 characters
									(used to create playlists like
									"nickname-album title")
								</li>
								<li>one submission per week per person</li>
								<li>any genre or language is welcome</li>
								<li>
									you can submit anonymously or share your
									spotify profile
								</li>
							</ul>
						</>
					}
				/>

				<FAQItem
					id="faq-privacy"
					question="privacy & data"
					answer={
						<>
							<p>here's what I store:</p>
							<ul>
								<li>
									a hashed version of your browser fingerprint
									and IP (for the one-submission-per-week
									limit)
								</li>
								<li>your nickname</li>
								<li>
									your spotify profile URL (only if you choose
									not to be anonymous)
								</li>
								<li>the album details you submitted</li>
							</ul>
							<p>
								the app uses basic fingerprinting solely to
								enforce the submission limit. your data isn't
								shared with anyone, and identifying info is
								one-way hashed so it can't be reversed.
							</p>
						</>
					}
				/>

				<FAQItem
					id="faq-weekly"
					question="how do you pick the weekly album?"
					answer={<p>vibes.</p>}
				/>

				<FAQItem
					id="faq-creator"
					question="who made this?"
					answer={
						<p>
							hi, i'm{" "}
							<a href="https://whybhav.in/" target="_blank">
								bhav
							</a>
							. i hope you like my little corner of the web for
							music sharing. check out my{" "}
							<a
								href="https://open.spotify.com/user/0rs4afffl5o4avb4ilxbot2ty"
								target="_blank"
							>
								spotify
							</a>{" "}
							if you're curious about my listening habits. the
							code is available on{" "}
							<a
								href="https://github.com/codebhav/album-exchange"
								target="_blank"
							>
								gitHub
							</a>{" "}
							if you want to see how it works or build something
							similar.
						</p>
					}
				/>
			</div>
		</section>
	);
}

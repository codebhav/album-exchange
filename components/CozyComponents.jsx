import Image from "next/image";
import { IoMusicalNotes, IoHeadset } from "react-icons/io5";

export function CuteToggle({ label, onChange, checked, id }) {
	const toggleId =
		id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

	return (
		<div className="toggle-container">
			<label className="toggle" htmlFor={toggleId}>
				<input
					type="checkbox"
					onChange={onChange}
					checked={checked}
					id={toggleId}
					aria-checked={checked}
				/>
				<span className="toggle-slider" aria-hidden="true"></span>
			</label>
			<span id={`${toggleId}-label`}>{label}</span>
		</div>
	);
}

export function CozyButton({
	children,
	onClick,
	type = "button",
	disabled = false,
	ariaLabel,
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className="button"
			aria-label={ariaLabel || undefined}
		>
			{children}
		</button>
	);
}

export function CozyInput({
	label,
	type = "text",
	placeholder,
	value,
	onChange,
	name,
	disabled = false,
	id,
	required = false,
	ariaDescribedBy,
}) {
	const inputId =
		id || `input-${name || Math.random().toString(36).substring(2, 9)}`;

	return (
		<div className="input-group">
			{label && <label htmlFor={inputId}>{label}</label>}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				name={name}
				disabled={disabled}
				id={inputId}
				required={required}
				aria-required={required}
				aria-describedby={ariaDescribedBy}
			/>
		</div>
	);
}

export function AlbumCard({
	albumImage,
	albumName,
	artistName,
	recommendedBy = null,
	albumUrl = null,
	profileUrl = null,
	onImageError = null,
}) {
	const AlbumContent = () => (
		<>
			<div className="album-image">
				<Image
					src={albumImage || "/images/album-placeholder.jpg"}
					alt={`Album cover: ${albumName} by ${artistName}`}
					width={300}
					height={300}
					quality={85}
					placeholder="blur"
					blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f8e2cf'/%3E%3C/svg%3E"
					className="album-cover-image"
					sizes="(max-width: 768px) 100vw, 300px"
					onError={onImageError ? onImageError : undefined}
				/>
			</div>
			<h3 className="album-title">{albumName}</h3>
			<p className="album-artist">{artistName}</p>

			{recommendedBy && (
				<div
					className="recommended-by"
					aria-label={`recommended by ${recommendedBy}`}
				>
					<IoMusicalNotes className="green-icon" aria-hidden="true" />
					<span>Recommended by {recommendedBy}</span>
				</div>
			)}
		</>
	);

	if (albumUrl) {
		return (
			<div className="album-card-container">
				<a
					href={albumUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="album-card"
					style={{
						textDecoration: "none",
						color: "inherit",
						display: "block",
					}}
				>
					<AlbumContent />
				</a>

				{profileUrl && recommendedBy && (
					<div
						className="profile-link"
						style={{ marginTop: "0.5rem", textAlign: "center" }}
					>
						<a
							href={profileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="profile-button"
							style={{
								display: "inline-block",
								padding: "0.25rem 0.75rem",
								borderRadius: "9999px",
								backgroundColor: "var(--color-terracotta)",
								color: "white",
								fontSize: "0.75rem",
								textDecoration: "none",
							}}
						>
							view {recommendedBy}&apos;s profile
						</a>
					</div>
				)}
			</div>
		);
	}

	if (profileUrl && recommendedBy && !albumUrl) {
		return (
			<div className="album-card">
				<AlbumContent />
				<div className="recommended-by">
					<IoMusicalNotes className="green-icon" />
					<span>
						recommended by{" "}
						<a
							href={profileUrl}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								color: "var(--color-terracotta)",
								textDecoration: "underline",
							}}
						>
							{recommendedBy}
						</a>
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="album-card">
			<AlbumContent />
		</div>
	);
}

export function NowPlaying({ track, isPlaying }) {
	if (!track) return null;

	return (
		<div className="now-playing">
			<a
				href={`https://open.spotify.com/track/${track.id}`}
				target="_blank"
				rel="noopener noreferrer"
				style={{
					textDecoration: "none",
					color: "inherit",
					display: "flex",
					alignItems: "center",
					gap: "1rem",
				}}
				aria-label={`${
					isPlaying ? "currently playing" : "Last played"
				}: ${track.name} by ${track.artist} from the album ${
					track.album
				}`}
			>
				<div className="track-image">
					<Image
						src={track.albumImageUrl}
						alt={`Album cover for ${track.album}`}
						width={64}
						height={64}
						quality={80}
						placeholder="blur"
						blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f8e2cf'/%3E%3C/svg%3E"
						className="track-cover-image"
						priority={true}
					/>
				</div>

				<div className="track-info">
					<div className="playing-status">
						<IoHeadset aria-hidden="true" />
						<span>
							{isPlaying ? "currently playing" : "last played"}
						</span>
					</div>
					<p className="track-name">{track.name}</p>
					<p className="track-details">
						{track.artist} • {track.album}
					</p>
				</div>
			</a>
		</div>
	);
}

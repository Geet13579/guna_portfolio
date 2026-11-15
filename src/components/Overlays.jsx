/** Film grain, scanlines and vignette — fixed over the whole site. */
export default function Overlays() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}

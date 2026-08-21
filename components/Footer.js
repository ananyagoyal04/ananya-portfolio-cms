export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-row">
        <span>&copy; {new Date().getFullYear()} Ananya Goyal</span>
        <span>Designed &amp; built by Ananya, one commit at a time.</span>
        <a href="#top">Back to top &#8593;</a>
      </div>
    </footer>
  );
}

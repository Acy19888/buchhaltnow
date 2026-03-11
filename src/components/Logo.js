export default function Logo({ small }) {
  return (
    <svg width={small ? 120 : 158} height={small ? 26 : 34} viewBox="0 0 280 60" fill="none">
      <path d="M15 12V48C15 48 27 48 33 48C39 48 43 44 43 38C43 32 39 28 33 28C27 28 15 28 15 28M15 28C15 28 27 28 33 28C39 28 43 24 43 18C43 12 39 8 33 8C27 8 15 8 15 8V12"
        stroke="#22D3A6" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43 28L57 48V12" stroke="#22D3A6" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="75" y="38" fill="#FFF" fontFamily="Inter,-apple-system,sans-serif" fontSize="26" fontWeight="500">Buchhalt</text>
      <text x="192" y="38" fill="#FFF" fontFamily="Inter,-apple-system,sans-serif" fontSize="26" fontWeight="700">Now</text>
    </svg>
  );
}

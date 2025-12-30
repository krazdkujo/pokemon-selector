export default function AuthTabs({ activeTab, onTabChange }) {
  return (
    <div className="auth-tabs">
      <button
        type="button"
        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => onTabChange('login')}
      >
        Log In
      </button>
      <button
        type="button"
        className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
        onClick={() => onTabChange('signup')}
      >
        Sign Up
      </button>
    </div>
  )
}

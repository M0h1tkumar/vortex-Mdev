import { useState, useEffect } from 'react';
import { NeonBorderCard } from '../../components/ui/NeonBorderCard';
import { ScrambleText } from '../../components/ui/ScrambleText';
import './styles.css';

function Registration({ onRegister, apiUrl }) {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [domains, setDomains] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [psList, setPsList] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [otp, setOtp] = useState('');
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    gender: '',
    institutionId: '',
    domainId: '',
    psId: '',
    summary: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/domains`)
      .then(res => res.json())
      .then(setDomains);
    fetch(`${apiUrl}/awards/institutes`)
      .then(res => res.json())
      .then(setInstitutes);
    fetch(`${apiUrl}/problem-statements`)
      .then(res => res.json())
      .then(data => setPsList(data.problemStatements || []));
  }, [apiUrl]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'REGISTRATION_FAILURE');
      return;
    }

    setStudentId(data.studentId);
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`${apiUrl}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, otp }),
    });

    if (!res.ok) {
      setError('INVALID_OTP');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="registration-page">
        <NeonBorderCard className="w-full max-w-[500px]">
          <div className="registration-success glass-card">
            <div className="success-icon">✓</div>
            <h2>UPLINK_SUCCESSFUL</h2>
            <p>Registration received. Mission Control will verify your clearance. Check email for updates.</p>
          </div>
        </NeonBorderCard>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <NeonBorderCard className="w-full max-w-[500px] z-10">
        <div className="registration-form glass-card">
          <div className="form-header">
            <h2><ScrambleText text={step === 1 ? "INIT_OPERATIVE_LINK" : "OTP_VERIFICATION"} className="text-3xl text-[var(--accent-cyan)] font-mono" /></h2>
            <p>{step === 1 ? "ESTABLISH_SECURE_CONNECTION" : "TRANSMIT_VERIFICATION_CODE"}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleRegister} className="form-grid">
              <input
                placeholder="FULL_NAME"
                className="input-glass"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                className="input-glass"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
              <select
                className="select-glass"
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                required
              >
                <option value="">GENDER</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                className="select-glass"
                value={form.institutionId}
                onChange={e => setForm({ ...form, institutionId: e.target.value })}
                required
              >
                <option value="">STATION (INSTITUTE)</option>
                {institutes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <select
                className="select-glass"
                value={form.domainId}
                onChange={e => setForm({ ...form, domainId: e.target.value })}
                required
              >
                <option value="">TACTICAL_SECTOR (DOMAIN)</option>
                {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select
                className="select-glass"
                value={form.psId}
                onChange={e => setForm({ ...form, psId: e.target.value })}
                required
              >
                <option value="">MISSION_OBJECTIVE (PS)</option>
                {psList.map(ps => <option key={ps.id} value={ps.id}>{ps.title}</option>)}
              </select>
              <textarea
                placeholder="OPERATIVE_SUMMARY (MAX 200 WORDS)"
                className="input-glass"
                style={{ minHeight: '100px' }}
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                required
              />
              <button type="submit" className="glow-button submit-btn">INITIALIZE_UPLINK</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="form-grid">
              <input
                placeholder="ENTER_OTP_CODE"
                className="input-glass"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="glow-button submit-btn">VERIFY_PROTOCOL</button>
            </form>
          )}
        </div>
      </NeonBorderCard>
    </div>
  );
}

export default Registration;

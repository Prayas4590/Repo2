import React, { useMemo, useState } from 'react';
import logo from '@/assests/Logo.jpg';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const states = ['Haryana', 'Punjab', 'Delhi', 'UP'];
const haryanaDistricts = ['Palwal', 'Faridabad', 'Gurgaon', 'Sonipat'];

const formatAadhaar = (v: string) => v.replace(/\D/g, '').slice(0, 12);
const isValidAadhaar = (v: string) => /^\d{12}$/.test(v);
const isValidMobile = (v: string) => /^\d{10}$/.test(v);
const calcAge = (dob: string) => {
  if (!dob) return '';
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970).toString();
};
const uidFor = (role: string) => `${['Asha Worker','Citizen','Doctor','Health Facility Coordinator'].indexOf(role) > -1 ? role.split(' ').map(s=>s[0]).join('') : 'JD'}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-semibold text-base mb-2 text-text-primary">{children}</div>
);

const TextField = ({ label, value, onChange, placeholder, type = 'text', disabled = false, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white text-base outline-none focus:ring-2 focus:ring-primary"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      inputMode={inputMode}
    />
  </div>
);

const RadioGroup = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-6">
      {options.map(opt => (
        <label key={opt} className="flex items-center text-base font-normal">
          <input type="radio" value={opt} checked={value === opt} onChange={() => onChange(opt)} className="mr-2 accent-green-700" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white text-base focus:ring-2 focus:ring-primary" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const UploadBox = ({ label, onFile, buttonText = "Browse Files", id }: { label: string; onFile: (f: File) => void; buttonText?: string; id: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 py-5 px-2 text-center cursor-pointer" onClick={() => document.getElementById(id)?.click()}>
      <input type="file" style={{ display: 'none' }} id={id} onChange={e => {
        const files = e.target.files;
        if (files && files.length > 0) {
          onFile(files[0]);
        }
      }} />
      <span className="text-green-700 font-medium">{buttonText}</span>
    </div>
  </div>
);

const ActionButton = ({ text, colorClass, onClick, disabled }: { text: string; colorClass?: string; onClick?: () => void; disabled?: boolean }) => (
  <button type="button" className={`w-full py-3 mt-1 rounded-lg font-semibold text-white text-base ${disabled ? 'bg-gray-300' : (colorClass ?? 'bg-[#72B841]')}`} onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

const Header = ({ back, title, role }: { back?: () => void; title?: string; role?: string }) => (
  <div className="flex items-center mb-6">
    {back ? (
      <span className="text-2xl cursor-pointer select-none mr-4" onClick={back}>&larr;</span>
    ) : (
      <span className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-4">
        <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
      </span>
    )}
    <div className="flex-grow text-center font-bold text-lg">
      {title ?? 'Sign Up'}
      {role && <span className="ml-2 text-base font-normal">{role} Sign Up</span>}
    </div>
  </div>
);

const AadhaarAuth = ({ onVerified }: { onVerified: (aadhaar: string) => void }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const canSend = isValidAadhaar(aadhaar);
  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(code);
    setOtp('');
    setOtpSent(true);
  };
  const verify = () => {
    if (otp === sentOtp && otp.length === 6) onVerified(aadhaar);
  };
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <SectionTitle>Aadhaar Verification</SectionTitle>
      <TextField label="Aadhaar Number" value={aadhaar} onChange={(v)=>setAadhaar(formatAadhaar(v))} placeholder="12-digit Aadhaar" inputMode="numeric" />
      {!otpSent ? (
        <ActionButton text="Send OTP" onClick={sendOtp} disabled={!canSend} />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
          <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="mb-3">
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <div className="text-xs text-gray-500 mb-2">Demo OTP: {sentOtp}</div>
          <ActionButton text="Verify" onClick={verify} disabled={otp.length !== 6} />
        </div>
      )}
    </div>
  );
};

const PasswordSection = ({ onSet }: { onSet: (password: string) => void }) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const canSet = p1.length >= 6 && p1 === p2;
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <SectionTitle>Create Password</SectionTitle>
      <TextField label="Password" value={p1} onChange={setP1} type="password" placeholder="At least 6 characters" />
      <TextField label="Confirm Password" value={p2} onChange={setP2} type="password" placeholder="Re-enter password" />
      <ActionButton text="Set Password" onClick={() => onSet(p1)} disabled={!canSet} />
    </div>
  );
};

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    {children}
  </div>
);

const RoleSelectCard = ({ role, setRole }: { role: string; setRole: (role: string) => void }) => (
  <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
    <Header />
    <div className="text-[22px] font-bold text-center mt-2 mb-8">Join Jeevan Dhara</div>
    <label className="block font-medium text-gray-700 mb-3 text-base">Select your role</label>
    <select className="w-full rounded-lg border border-gray-300 px-3 py-3 bg-white mb-2 text-[16px] focus:ring-2 focus:ring-primary" value={role} onChange={e => setRole(e.target.value)}>
      <option value="">Select role</option>
      <option value="Asha Worker">Asha Worker</option>
      <option value="Citizen">Citizen</option>
      <option value="Doctor">Doctor</option>
      <option value="Health Facility Coordinator">Health Facility Coordinator</option>
    </select>
  </div>
);

const FormAshaWorker = ({ back }: { back: () => void }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const age = useMemo(() => calcAge(dob), [dob]);
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [area, setArea] = useState('');
  const [ashaId, setAshaId] = useState('');
  const [ashaCard, setAshaCard] = useState<File | null>(null);
  const [aadhaarVerified, setAadhaarVerified] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const canContinue = name && dob && gender && isValidMobile(mobile) && area && ashaId && !!ashaCard;

  const submit = () => {
    const id = uidFor('Asha Worker');
    setUserId(id);
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Asha Worker" />
      <div className="mb-2">
        <SectionTitle>Personal Details</SectionTitle>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
        <TextField label="Date of Birth" value={dob} onChange={setDob} type="date" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <TextField label="Mobile Number" value={mobile} onChange={(v)=>setMobile(v.replace(/\D/g,'').slice(0,10))} placeholder="10-digit mobile" inputMode="numeric" />
      </div>
      <div className="border rounded-lg p-4 mb-4 mt-2 bg-gray-50">
        <SectionTitle>Asha Details</SectionTitle>
        <TextField label="Area of Operation" value={area} onChange={setArea} placeholder="e.g., Village Primary Health Center" />
        <TextField label="Asha ID Number" value={ashaId} onChange={setAshaId} placeholder="Enter your Asha ID" />
        <UploadBox label="Upload Asha ID Card/Proof" onFile={setAshaCard} buttonText="Browse Files" id="asha-id-upload" />
      </div>
      {!aadhaarVerified && (
        <AadhaarAuth onVerified={setAadhaarVerified} />
      )}
      {aadhaarVerified && !password && (
        <div className="mt-3"><PasswordSection onSet={setPassword} /></div>
      )}
      {aadhaarVerified && password && !userId && (
        <ActionButton text="Create Account" onClick={submit} disabled={!canContinue} />
      )}
      {userId && (
        <InfoCard>
          <div className="font-semibold mb-2">Digital ID Card</div>
          <div className="text-sm">
            <div>User ID: <span className="font-medium">{userId}</span></div>
            <div>Role: Asha Worker</div>
            <div>Name: {name}</div>
            <div>Age: {age || '—'} | Gender: {gender || '—'}</div>
            <div>Asha ID: {ashaId}</div>
            <div>Area: {area}</div>
          </div>
          <div className="text-green-700 font-semibold mt-2">Account created</div>
        </InfoCard>
      )}
    </div>
  );
};

const FormCitizen = ({ back }: { back: () => void }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const canContinue = name && age && gender && dob && isValidMobile(mobile) && address && village && state && district;

  const submit = () => setUserId(uidFor('Citizen'));

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Citizen" />
      <div className="border-b pb-2 mb-2">
        <SectionTitle>Personal Details</SectionTitle>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
        <TextField label="Age" value={age} onChange={(v)=>setAge(v.replace(/\D/g,'').slice(0,3))} inputMode="numeric" placeholder="Enter your age" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <TextField label="Date of Birth" value={dob} onChange={setDob} type="date" />
        <TextField label="Mobile Number" value={mobile} onChange={(v)=>setMobile(v.replace(/\D/g,'').slice(0,10))} inputMode="numeric" placeholder="10-digit mobile" />
        <TextField label="Address" value={address} onChange={setAddress} placeholder="House, Street" />
        <TextField label="Village/Locality" value={village} onChange={setVillage} placeholder="Village" />
        <SelectField label="State" value={state} onChange={setState} options={states} />
        <SelectField label="District" value={district} onChange={setDistrict} options={state === 'Haryana' ? haryanaDistricts : ['District 1', 'District 2', 'District 3']} />
      </div>
      {!aadhaarVerified && (
        <AadhaarAuth onVerified={setAadhaarVerified} />
      )}
      {aadhaarVerified && !password && (
        <div className="mt-3"><PasswordSection onSet={setPassword} /></div>
      )}
      {aadhaarVerified && password && !userId && (
        <ActionButton text="Create Account" onClick={submit} disabled={!canContinue} />
      )}
      {userId && (
        <InfoCard>
          <div className="font-semibold mb-2">Citizen Card</div>
          <div className="text-sm">
            <div>User ID: <span className="font-medium">{userId}</span></div>
            <div>Name: {name}</div>
            <div>State: {state} | District: {district} | Village: {village}</div>
            <div>Age: {age} | Gender: {gender}</div>
          </div>
          <div className="text-green-700 font-semibold mt-2">Account created</div>
        </InfoCard>
      )}
    </div>
  );
};

const FormDoctor = ({ back }: { back: () => void }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [regNum, setRegNum] = useState('');
  const [regDoc, setRegDoc] = useState<File | null>(null);
  const [practiceSite, setPracticeSite] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [phcRole, setPhcRole] = useState('');
  const [phcLocation, setPhcLocation] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const canContinue = name && age && gender && isValidMobile(mobile) && regNum && !!regDoc && practiceSite && state && district && (
    (practiceSite === 'Local Clinic' && clinicAddress && clinicLocation) ||
    (practiceSite === 'PHC' && phcRole && phcLocation) ||
    (practiceSite === 'Hospital' && hospitalName)
  );

  const submit = () => setUserId(uidFor('Doctor'));

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Doctor" />
      <div className="border-b pb-2 mb-2">
        <SectionTitle>Personal Details</SectionTitle>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
        <TextField label="Age" value={age} onChange={(v)=>setAge(v.replace(/\D/g,'').slice(0,3))} inputMode="numeric" placeholder="Enter your age" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <TextField label="Mobile Number" value={mobile} onChange={(v)=>setMobile(v.replace(/\D/g,'').slice(0,10))} inputMode="numeric" placeholder="10-digit mobile" />
      </div>
      <div className="border-b pb-2 mb-2">
        <SectionTitle>Professional Details</SectionTitle>
        <TextField label="Doctor Registration Number" value={regNum} onChange={setRegNum} placeholder="Registration number" />
        <UploadBox label="Registration/Certificate Upload" onFile={setRegDoc} buttonText="Upload Document" id="doctor-reg-upload" />
        <SelectField label="Practice Site" value={practiceSite} onChange={setPracticeSite} options={["Local Clinic","PHC","Hospital"]} />
        {practiceSite === 'Local Clinic' && (
          <>
            <TextField label="Clinic Address" value={clinicAddress} onChange={setClinicAddress} placeholder="Address" />
            <TextField label="Clinic Location" value={clinicLocation} onChange={setClinicLocation} placeholder="Area/Locality" />
          </>
        )}
        {practiceSite === 'PHC' && (
          <>
            <SelectField label="Role" value={phcRole} onChange={setPhcRole} options={["MBBS","AYUSH Practitioner"]} />
            <TextField label="PHC Location / Center No." value={phcLocation} onChange={setPhcLocation} placeholder="PHC code or location" />
          </>
        )}
        {practiceSite === 'Hospital' && (
          <TextField label="Hospital Name" value={hospitalName} onChange={setHospitalName} placeholder="Hospital name" />
        )}
        <SelectField label="State" value={state} onChange={setState} options={states} />
        <SelectField label="District" value={district} onChange={setDistrict} options={state === 'Haryana' ? haryanaDistricts : ['District 1', 'District 2', 'District 3']} />
      </div>
      {!aadhaarVerified && (
        <AadhaarAuth onVerified={setAadhaarVerified} />
      )}
      {aadhaarVerified && !password && (
        <div className="mt-3"><PasswordSection onSet={setPassword} /></div>
      )}
      {aadhaarVerified && password && !userId && (
        <ActionButton text="Create Account" onClick={submit} disabled={!canContinue} />
      )}
      {userId && (
        <InfoCard>
          <div className="font-semibold mb-2">Doctor Card</div>
          <div className="text-sm">
            <div>User ID: <span className="font-medium">{userId}</span></div>
            <div>Doctor Reg No: {regNum}</div>
            <div>State: {state} | District: {district}</div>
            <div>Practice: {practiceSite === 'Local Clinic' ? `Clinic (${clinicLocation})` : practiceSite === 'PHC' ? `PHC (${phcLocation}) - ${phcRole}` : `Hospital (${hospitalName})`}</div>
          </div>
          <div className="text-green-700 font-semibold mt-2">Account created</div>
        </InfoCard>
      )}
    </div>
  );
};

const FormCoordinator = ({ back }: { back: () => void }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [empId, setEmpId] = useState('');
  const [phcLocation, setPhcLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [idDoc, setIdDoc] = useState<File | null>(null);
  const [aadhaarVerified, setAadhaarVerified] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const canContinue = name && age && gender && email && isValidMobile(mobile) && designation && empId && phcLocation && state && district && !!idDoc;

  const submit = () => setUserId(uidFor('Health Facility Coordinator'));

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Health Facility Coordinator" />
      <div className="border-b pb-2 mb-2">
        <SectionTitle>Personal Details</SectionTitle>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Full name" />
        <TextField label="Age" value={age} onChange={(v)=>setAge(v.replace(/\D/g,'').slice(0,3))} inputMode="numeric" placeholder="Age" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <TextField label="Official Email Address" value={email} onChange={setEmail} type="email" placeholder="name@domain" />
        <TextField label="Mobile Number" value={mobile} onChange={(v)=>setMobile(v.replace(/\D/g,'').slice(0,10))} inputMode="numeric" placeholder="10-digit mobile" />
      </div>
      <div className="border-b pb-2 mb-2">
        <SectionTitle>Work Details</SectionTitle>
        <TextField label="Designation" value={designation} onChange={setDesignation} placeholder="Block Coordinator" />
        <TextField label="Employee ID Number" value={empId} onChange={setEmpId} placeholder="EMP7890" />
        <TextField label="PHC Center Code or Location" value={phcLocation} onChange={setPhcLocation} placeholder="PAL001 - Palwal PHC" />
        <SelectField label="State" value={state} onChange={setState} options={states} />
        <SelectField label="District" value={district} onChange={setDistrict} options={state === 'Haryana' ? haryanaDistricts : ['District 1', 'District 2', 'District 3']} />
      </div>
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <SectionTitle>Documents</SectionTitle>
        <UploadBox label="Official ID Document" onFile={setIdDoc} buttonText="Choose File" id="id-upload-coordinator" />
      </div>
      {!aadhaarVerified && (
        <AadhaarAuth onVerified={setAadhaarVerified} />
      )}
      {aadhaarVerified && !password && (
        <div className="mt-3"><PasswordSection onSet={setPassword} /></div>
      )}
      {aadhaarVerified && password && !userId && (
        <ActionButton text="Create Account" onClick={submit} disabled={!canContinue} />
      )}
      {userId && (
        <InfoCard>
          <div className="font-semibold mb-2">Coordinator Card</div>
          <div className="text-sm">
            <div>User ID: <span className="font-medium">{userId}</span></div>
            <div>Name: {name} | Age: {age} | Gender: {gender}</div>
            <div>PHC: {phcLocation}</div>
            <div>State: {state} | District: {district}</div>
            <div>Role: Health Facility Coordinator</div>
          </div>
          <div className="text-green-700 font-semibold mt-2">Account created</div>
        </InfoCard>
      )}
    </div>
  );
};

const SignUpForms = ({ role, setRole }: { role: string; setRole: (role: string) => void }) => {
  switch (role) {
    case 'Asha Worker': return <FormAshaWorker back={() => setRole('')} />;
    case 'Citizen': return <FormCitizen back={() => setRole('')} />;
    case 'Doctor': return <FormDoctor back={() => setRole('')} />;
    case 'Health Facility Coordinator': return <FormCoordinator back={() => setRole('')} />;
    default: return null;
  }
};

const JeevanDharaSignUp: React.FC = () => {
  const [role, setRole] = useState('');
  return (
    <div className="bg-[#fafbfb] min-h-screen font-sans px-2 py-2">
      {role
        ? <SignUpForms role={role} setRole={setRole} />
        : <RoleSelectCard role={role} setRole={setRole} />}
    </div>
  );
};

export default JeevanDharaSignUp;

import React, { useState } from 'react';
import logo from '@/assests/Logo.jpg';

const states = ['Haryana', 'Punjab', 'Delhi', 'UP'];
const haryanaDistricts = ['Palwal', 'Faridabad', 'Gurgaon', 'Sonipat'];

const TextField = ({ label, value, onChange, placeholder, type = 'text', disabled = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-base outline-none"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
    />
  </div>
);

const RadioGroup = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
    <div className="flex gap-7">
      {options.map(opt => (
        <label key={opt} className="flex items-center text-base font-normal">
          <input type="radio" value={opt} checked={value === opt} onChange={() => onChange(opt)} className="mr-2 accent-green-600" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-base" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const UploadBox = ({ label, onFile, buttonText = "Browse Files", id }: { label: string; onFile: (f: File) => void; buttonText?: string; id: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="border border-dashed border-gray-300 rounded-md bg-gray-100 py-5 px-2 text-center cursor-pointer" onClick={() => document.getElementById(id)?.click()}>
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

const ActionButton = ({ text, colorClass, onClick }: { text: string; colorClass?: string; onClick?: () => void }) => (
  <button type="button" className={`w-full py-3 mt-1 rounded-md font-semibold text-white text-base ${colorClass ?? 'bg-[#72B841]'}`} onClick={onClick}>
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

const RoleSelectCard = ({ role, setRole }: { role: string; setRole: (role: string) => void }) => (
  <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
    <Header />
    <div className="text-[22px] font-bold text-center mt-2 mb-8">Join Jeevan Dhara</div>
    <label className="block font-medium text-gray-600 mb-3 text-base">Select your role</label>
    <select className="w-full rounded-md border border-gray-300 px-3 py-3 bg-white mb-2 text-[16px]" value={role} onChange={e => setRole(e.target.value)}>
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
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [area, setArea] = useState('');
  const [ashaId, setAshaId] = useState('');
  const [ashaCard, setAshaCard] = useState<File | null>(null);
  const [aadhaar, setAadhaar] = useState<File | null>(null);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Asha Worker" />
      <div className="mb-2">
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
        <TextField label="Date of Birth" value={dob} onChange={setDob} type="date" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <div className="flex gap-2 items-center">
          <TextField label="Mobile Number" value={mobile} onChange={setMobile} placeholder="Enter your mobile number" />
          <button type="button" className="bg-gray-100 text-[#72B841] font-semibold px-4 py-2 rounded-md text-[14px] ml-1 mt-5">Send OTP</button>
        </div>
      </div>
      <div className="border rounded-lg p-4 mb-4 mt-2 bg-gray-50">
        <div className="font-semibold text-[15px] mb-2">Asha Details</div>
        <TextField label="Area of Operation" value={area} onChange={setArea} placeholder="e.g., Village Primary Health Center" />
        <TextField label="Asha ID Number" value={ashaId} onChange={setAshaId} placeholder="Enter your Asha ID" />
        <UploadBox label="Upload Asha ID Card/Proof" onFile={setAshaCard} buttonText="Browse Files" id="asha-id-upload" />
      </div>
      <div className="border rounded-lg p-4 mb-2 bg-gray-50">
        <div className="font-semibold text-[15px] mb-2">Government Documents</div>
        <UploadBox label="Upload Aadhaar Card" onFile={setAadhaar} buttonText="Browse Files" id="aadhaar-upload" />
      </div>
      <ActionButton text="Submit Application" />
      <div className="text-[#72B841] text-center mt-4 text-[15px] font-semibold">Verification pending</div>
    </div>
  );
};

const FormCitizen = ({ back }: { back: () => void }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [aadhaar, setAadhaar] = useState<File | null>(null);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Citizen" />
      <div className="border-b pb-2 mb-2">
        <div className="font-semibold text-base mb-2">Personal Details</div>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
        <TextField label="Age" value={age} onChange={setAge} type="number" placeholder="Enter your age" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <TextField label="Date of Birth" value={dob} onChange={setDob} type="date" />
        <TextField label="Mobile Number" value={mobile} onChange={setMobile} type="tel" placeholder="Enter your 10-digit mobile number" />
        <TextField label="Address" value={address} onChange={setAddress} placeholder="Enter your complete address" />
        <SelectField label="State" value={state} onChange={setState} options={states} />
        <SelectField label="District" value={district} onChange={setDistrict} options={state === 'Haryana' ? haryanaDistricts : ['District 1', 'District 2', 'District 3']} />
      </div>
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <div className="font-semibold text-[15px] mb-2">Government Documents</div>
        <UploadBox label="Aadhaar Card" onFile={setAadhaar} buttonText="Upload File" id="aadhaar-upload-citizen" />
      </div>
      <ActionButton text="Continue" colorClass="bg-[#72B841]" />
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
  const [practiceType, setPracticeType] = useState('');
  const [aadhaar, setAadhaar] = useState<File | null>(null);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Doctor" />
      <div className="border-b pb-2 mb-2">
        <div className="font-semibold text-base mb-2">Personal Details</div>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
        <TextField label="Age" value={age} onChange={setAge} type="number" placeholder="Enter your age" />
        <RadioGroup label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
        <TextField label="Mobile Number" value={mobile} onChange={setMobile} type="tel" placeholder="Enter mobile number" />
      </div>
      <div className="border-b pb-2 mb-2">
        <div className="font-semibold text-base mb-2">Professional Details</div>
        <TextField label="Doctor Registration Number" value={regNum} onChange={setRegNum} placeholder="Enter registration number" />
        <UploadBox label="Registration/Certificate Upload" onFile={setRegDoc} buttonText="Upload Document" id="doctor-reg-upload" />
        <SelectField label="Practice Type" value={practiceType} onChange={setPracticeType} options={['General Physician', 'Specialist', 'Surgeon']} />
      </div>
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <div className="font-semibold text-[15px] mb-2">Government Documents</div>
        <UploadBox label="Aadhaar Card Upload" onFile={setAadhaar} buttonText="Upload Document" id="aadhaar-upload-doctor" />
      </div>
      <ActionButton text="Continue to OTP Verification" colorClass="bg-[#72B841]" />
    </div>
  );
};

const FormCoordinator = ({ back }: { back: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [empId, setEmpId] = useState('');
  const [phcLocation, setPhcLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [aadhaar, setAadhaar] = useState<File | null>(null);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
      <Header back={back} role="Health Facility Coordinator" />
      <div className="border-b pb-2 mb-2">
        <div className="font-semibold text-base mb-2">Personal Details</div>
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Sushil Kumar" />
        <TextField label="Official Email Address" value={email} onChange={setEmail} type="email" placeholder="sushil.kumar@haryana.gov.in" />
        <TextField label="Mobile Number" value={mobile} onChange={setMobile} type="tel" placeholder="9876543210" />
      </div>
      <div className="border-b pb-2 mb-2">
        <div className="font-semibold text-base mb-2">Work Details</div>
        <TextField label="Designation" value={designation} onChange={setDesignation} placeholder="Block Coordinator" />
        <TextField label="Employee ID Number" value={empId} onChange={setEmpId} placeholder="EMP7890" />
        <TextField label="PHC Center Code or Location" value={phcLocation} onChange={setPhcLocation} placeholder="PAL001 - Palwal PHC" />
        <SelectField label="State" value={state} onChange={setState} options={states} />
        <SelectField label="District" value={district} onChange={setDistrict} options={state === 'Haryana' ? haryanaDistricts : ['District 1', 'District 2', 'District 3']} />
      </div>
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <div className="font-semibold text-[15px] mb-2">Government Documents</div>
        <UploadBox label="Aadhaar Card" onFile={setAadhaar} buttonText="Choose File" id="aadhaar-upload-coordinator" />
      </div>
      <ActionButton text="Continue" colorClass="bg-[#72B841]" />
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
    <div className="bg-[#fafbfb] min-h-screen font-sans px-2">
      {role
        ? <SignUpForms role={role} setRole={setRole} />
        : <RoleSelectCard role={role} setRole={setRole} />}
    </div>
  );
};

export default JeevanDharaSignUp;

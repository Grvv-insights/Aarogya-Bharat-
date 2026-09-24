import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Hospital } from '../models/Hospital';
import { Doctor } from '../models/Doctor';
import { Treatment } from '../models/Treatment';
import { Appointment } from '../models/Appointment';
import { Consultation } from '../models/Consultation';
import { MedicalDocument } from '../models/MedicalDocument';
import { Review } from '../models/Review';
import { TravelPlan } from '../models/TravelPlan';

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_tourism_db';
  console.log(`[Seed] Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);

  console.log('[Seed] Clearing all existing prototype collections...');
  await Promise.all([
    User.deleteMany({}),
    Hospital.deleteMany({}),
    Doctor.deleteMany({}),
    Treatment.deleteMany({}),
    Appointment.deleteMany({}),
    Consultation.deleteMany({}),
    MedicalDocument.deleteMany({}),
    Review.deleteMany({}),
    TravelPlan.deleteMany({})
  ]);

  // 1. Create Demo Users
  console.log('[Seed] Creating demo users (patient, provider, admin)...');
  const patient = await User.create({
    name: 'Sarah Jenkins',
    email: 'patient@example.com',
    passwordHash: 'Password123!',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    profile: {
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      bio: 'Planning robotic knee replacement in Delhi NCR.',
      preferredLanguage: 'English'
    }
  });

  const provider = await User.create({
    name: 'Apollo International Desk',
    email: 'provider@apollo.com',
    passwordHash: 'Password123!',
    role: 'provider',
    phone: '+91 44 2829 0200',
    country: 'India',
    profile: {
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
      bio: 'Apollo Hospitals International Patient Liaison Team.',
      preferredLanguage: 'English'
    }
  });

  const admin = await User.create({
    name: 'Aarogya Administrator',
    email: 'admin@medvoyage.in',
    passwordHash: 'Password123!',
    role: 'admin',
    phone: '+91 11 4050 6070',
    country: 'India',
    profile: {
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      bio: 'Medical Value Travel Platform Administrator.',
      preferredLanguage: 'English'
    }
  });

  // 2. Create Hospitals (9 Hospitals across Delhi NCR, Chennai, Bengaluru, Mumbai, Hyderabad, Kochi)
  console.log('[Seed] Creating 9 accredited hospitals...');
  const hospitalDocs = await Hospital.create([
    {
      name: 'Apollo Hospitals, Greams Road',
      slug: 'apollo-hospitals-chennai',
      description: 'The flagship hospital of the Apollo Group, renowned worldwide as the pioneer of modern private healthcare in India with over 150,000 cardiac procedures performed.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: '21 Greams Lane, Off Greams Road, Thousand Lights, Chennai 600006',
      specialties: ['Cardiology', 'Oncology', 'Organ Transplants', 'Robotic Surgery', 'Orthopedics'],
      treatments: [],
      facilities: ['Dedicated International Lounge', 'VIP Suites', 'Language Translators', 'Airport Escort Service', 'Forex Counter', 'Prayer Rooms'],
      accreditation: ['JCI', 'NABH', 'NABL'],
      internationalPatientServices: ['Medical Visa Assistance', 'Airport VIP Pickup', 'Interpreter Service (Arabic, Russian, French)', 'Forex Exchange', 'Dietary Concierge'],
      languagesSupported: ['English', 'Hindi', 'Arabic', 'French', 'Russian', 'Swahili', 'Bengali', 'Tamil'],
      contact: { email: 'international@apollohospitals.com', phone: '+91 44 2829 0200', website: 'https://apollohospitals.com' },
      verificationStatus: 'verified',
      rating: 4.9,
      reviewCount: 1420,
      bedCount: 710,
      establishedYear: 1983,
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80']
    },
    {
      name: 'Fortis Memorial Research Institute (FMRI)',
      slug: 'fortis-memorial-gurugram',
      description: 'Often dubbed the "Next Generation Hospital", FMRI is a premier multi-super speciality quaternary care hospital with international faculty and advanced robotic surgery suites.',
      city: 'Delhi NCR',
      state: 'Haryana',
      address: 'Sector 44, Opposite HUDA City Centre Metro Station, Gurugram 122002',
      specialties: ['Neurosciences', 'Oncology', 'Bone Marrow Transplant', 'Orthopedics & Spine', 'Robotic Surgery'],
      treatments: [],
      facilities: ['CyberKnife VSI', '3T Digital MRI', 'Dedicated Medical Visa Desk', 'International Cuisine Cafeteria', 'Deluxe Patient Suites'],
      accreditation: ['JCI', 'NABH'],
      internationalPatientServices: ['Embassy Coordination', 'Private Airport Transfers', 'Dedicated Case Manager', 'Remote Second Opinion'],
      languagesSupported: ['English', 'Hindi', 'Arabic', 'Russian', 'Uzbek', 'French'],
      contact: { email: 'international.fmri@fortishealthcare.com', phone: '+91 124 496 2200', website: 'https://fortishealthcare.com' },
      verificationStatus: 'verified',
      rating: 4.8,
      reviewCount: 980,
      bedCount: 1000,
      establishedYear: 2013,
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80']
    },
    {
      name: 'Medanta - The Medicity',
      slug: 'medanta-the-medicity-gurugram',
      description: 'Spread over 43 acres with 1,250 beds and 6 institutes, founded by eminent cardiac surgeon Dr. Naresh Trehan to bring world-class healthcare to global citizens.',
      city: 'Delhi NCR',
      state: 'Haryana',
      address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram 122001',
      specialties: ['Heart Institute', 'Liver & Biliary Sciences', 'Kidney & Urology', 'Neurosciences', 'Cancer Institute'],
      treatments: [],
      facilities: ['Flying Doctors Air Ambulance', 'Da Vinci Xi Robotic System', 'Dedicated International Wing', 'Multi-faith Meditation Space'],
      accreditation: ['JCI', 'NABH', 'NABL'],
      internationalPatientServices: ['Telehealth Consultations', 'MED-1 Visa Paperwork', 'Airport Chauffeur', 'Direct Hospital Admission'],
      languagesSupported: ['English', 'Hindi', 'Arabic', 'French', 'Russian', 'Persian'],
      contact: { email: 'international.patients@medanta.org', phone: '+91 124 414 1414', website: 'https://medanta.org' },
      verificationStatus: 'verified',
      rating: 4.9,
      reviewCount: 1850,
      bedCount: 1250,
      establishedYear: 2009,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80']
    },
    {
      name: 'Max Super Speciality Hospital, Saket',
      slug: 'max-hospital-saket-delhi',
      description: 'One of the foremost premier healthcare institutions in India capital city, accredited by JCI with high clinical standards and international patient protocols.',
      city: 'Delhi NCR',
      state: 'Delhi',
      address: '1, 2, Press Enclave Marg, Saket Institutional Area, New Delhi 110017',
      specialties: ['Cardiac Sciences', 'Cancer Care / Oncology', 'Neurosciences', 'Orthopedics', 'Minimal Access Surgery'],
      treatments: [],
      facilities: ['Intraoperative MRI (BrainSUITE)', 'TrueBeam Linac for Oncology', 'International Guest House', 'Embassy Liaison Support'],
      accreditation: ['JCI', 'NABH'],
      internationalPatientServices: ['Visa Invitation Letters', 'International Patient Lounge', 'Private Currency Exchange', 'Multilingual Attendants'],
      languagesSupported: ['English', 'Hindi', 'Arabic', 'Russian', 'French'],
      contact: { email: 'international@maxhealthcare.com', phone: '+91 11 2651 5050', website: 'https://maxhealthcare.in' },
      verificationStatus: 'verified',
      rating: 4.8,
      reviewCount: 1120,
      bedCount: 530,
      establishedYear: 2006,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80']
    },
    {
      name: 'Manipal Hospital, Old Airport Road',
      slug: 'manipal-hospital-bengaluru',
      description: 'Located in India Silicon Valley, Manipal Hospital is celebrated for medical innovation, robotics, organ transplants, and compassionate care for global travelers.',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: '98, HAL Old Airport Road, Kodihalli, Bengaluru 560017',
      specialties: ['Spine & Neuro Surgery', 'Organ Transplant', 'Reproductive Medicine / IVF', 'Pediatric Cardiology', 'Oncology'],
      treatments: [],
      facilities: ['Robotic Knee Replacement Centre', 'Comprehensive IVF Lab', 'International Patient Lounge', 'Concierge & City Tour Desk'],
      accreditation: ['NABH', 'NABL', 'ISO'],
      internationalPatientServices: ['Visa Assistance', 'Airport Transfers', 'Hotel & Apartment Booking', 'Family Stay Coordination'],
      languagesSupported: ['English', 'Hindi', 'Arabic', 'German', 'Bengali', 'Kannada'],
      contact: { email: 'internationaldesk@manipalhospitals.com', phone: '+91 80 2502 4444', website: 'https://manipalhospitals.com' },
      verificationStatus: 'verified',
      rating: 4.7,
      reviewCount: 890,
      bedCount: 600,
      establishedYear: 1991,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80']
    },
    {
      name: 'Kokilaben Dhirubhai Ambani Hospital',
      slug: 'kokilaben-hospital-mumbai',
      description: 'India only hospital to have achieved 4 major international accreditations (JCI, CAP, NABL, NABH). A landmark quaternary care institute in Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai 400053',
      specialties: ['Cardiology', 'Robotic Surgery', 'Oncology', 'Sports Medicine & Joint Replacement', 'Cosmetic Surgery'],
      treatments: [],
      facilities: ['Full-time Specialist System (FTSS)', 'EDGE Radiosurgery', 'International Floor with Sea View Suites', 'VIP Dining'],
      accreditation: ['JCI', 'NABH', 'CAP', 'NABL'],
      internationalPatientServices: ['Chauffeur from Mumbai International Airport', 'Dedicated Relationship Manager', 'Local Sightseeing & Shopping Support'],
      languagesSupported: ['English', 'Hindi', 'Marathi', 'Gujarati', 'Arabic', 'French'],
      contact: { email: 'international.helpdesk@kokilabenhospitals.com', phone: '+91 22 4269 6969', website: 'https://kokilabenhospital.com' },
      verificationStatus: 'verified',
      rating: 4.9,
      reviewCount: 1310,
      bedCount: 750,
      establishedYear: 2008,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      gallery: []
    },
    {
      name: 'Yashoda Hospitals, Hitec City',
      slug: 'yashoda-hospitals-hyderabad',
      description: 'One of India largest and most advanced quaternary hospitals located in Hyderabad IT corridor, offering specialized organ transplantation and minimally invasive oncology.',
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Hitec City, Madhapur, Hyderabad 500081',
      specialties: ['Liver Transplants', 'Orthopedics', 'Gastroenterology', 'Urology & Robotic Surgery', 'Oncology'],
      treatments: [],
      facilities: ['RapidArc & Varian TrueBeam', 'Comprehensive Transplant ICU', 'International Liaison Lounge', 'Complimentary City Transfers'],
      accreditation: ['NABH', 'NABL', 'ISO'],
      internationalPatientServices: ['Medical Visa Issuance within 24h', 'Multilingual Interpreters', 'Customized Dietary Menus', 'Guest House Support'],
      languagesSupported: ['English', 'Hindi', 'Telugu', 'Arabic', 'Russian', 'Bengali'],
      contact: { email: 'international@yashodamail.com', phone: '+91 40 4567 4567', website: 'https://yashodahospitals.com' },
      verificationStatus: 'verified',
      rating: 4.8,
      reviewCount: 740,
      bedCount: 2000,
      establishedYear: 1989,
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
      gallery: []
    },
    {
      name: 'Aster Medcity, South Chittoor',
      slug: 'aster-medcity-kochi',
      description: 'A 670-bed waterfront medical city spread across 40 acres in Kochi, integrating world-class tertiary medicine with serene tropical Kerala recovery and wellness.',
      city: 'Kochi',
      state: 'Kerala',
      address: 'Kuttisahib Road, Cheranalloor, South Chittoor, Kochi 682027',
      specialties: ['Ayurveda & Integrative Medicine', 'Cardiology', 'Minimally Invasive Surgery', 'Orthopedics', 'Wellness Checkups'],
      treatments: [],
      facilities: ['Waterfront Recovery Pavilions', 'Integrative Wellness Wing', 'Helipad with Air Ambulance', 'Houseboat & Backwaters Concierge'],
      accreditation: ['JCI', 'NABH'],
      internationalPatientServices: ['Cochin International Airport Pickup', 'Backwater Wellness Tourism Packages', 'Medical Visa Stamping', 'Ayurvedic Follow-up'],
      languagesSupported: ['English', 'Hindi', 'Malayalam', 'Arabic', 'French', 'Russian'],
      contact: { email: 'international@asterhospital.com', phone: '+91 484 669 9999', website: 'https://astermedcity.com' },
      verificationStatus: 'verified',
      rating: 4.8,
      reviewCount: 650,
      bedCount: 670,
      establishedYear: 2014,
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      gallery: []
    },
    {
      name: 'Artemis Hospital',
      slug: 'artemis-hospital-gurugram',
      description: 'Established in 2007, Artemis was the first hospital in Gurugram to receive JCI and NABH accreditations, recognized for high surgical precision in oncology and cardiovascular sciences.',
      city: 'Delhi NCR',
      state: 'Haryana',
      address: 'Sector 51, Gurugram 122001',
      specialties: ['Oncology', 'Cardiovascular Surgery', 'Orthopedics', 'Neurosciences', 'Pediatric Surgery'],
      treatments: [],
      facilities: ['Endovascular Cath Lab', 'Bone Marrow Transplant Unit', 'International Patient Desk', 'Private Guest Accommodations'],
      accreditation: ['JCI', 'NABH'],
      internationalPatientServices: ['Expedited Visa Desk', 'Airport Escort', 'Post-Op Follow-up Clinic', 'Dedicated Interpreter Desk'],
      languagesSupported: ['English', 'Hindi', 'Arabic', 'Russian', 'French'],
      contact: { email: 'care@artemishospitals.com', phone: '+91 124 451 1111', website: 'https://artemishospitals.com' },
      verificationStatus: 'verified',
      rating: 4.7,
      reviewCount: 820,
      bedCount: 400,
      establishedYear: 2007,
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      gallery: []
    }
  ]);

  const [apollo, fortis, medanta, max, manipal, kokilaben, yashoda, aster, artemis] = hospitalDocs;

  // 3. Create Doctors (13 Doctors across specialties and hospitals)
  console.log('[Seed] Creating 13 renowned doctors...');
  const doctorDocs = await Doctor.create([
    {
      name: 'Dr. Ashwin Mehta',
      slug: 'dr-ashwin-mehta',
      hospital: apollo._id,
      specialization: 'Cardiology',
      qualification: 'MBBS, MD (Medicine), DM (Cardiology), FACC (USA)',
      experience: 28,
      languages: ['English', 'Hindi', 'Tamil'],
      bio: 'Senior Director of Interventional Cardiology with over 12,000 successful coronary and structural heart procedures.',
      consultationFee: { minUSD: 50, maxUSD: 75, minINR: 4000, maxINR: 6000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    },
    {
      name: 'Dr. Ashok Rajgopal',
      slug: 'dr-ashok-rajgopal',
      hospital: medanta._id,
      specialization: 'Orthopedics & Joint Replacement',
      qualification: 'MS (Ortho), MCh (Ortho, Liverpool), FRCS (London), Padma Shri Awardee',
      experience: 34,
      languages: ['English', 'Hindi', 'Punjabi'],
      bio: 'Internationally celebrated orthopedic surgeon with over 30,000 knee replacements performed. Pioneer in computer navigation and robotic arthroplasty in India.',
      consultationFee: { minUSD: 60, maxUSD: 90, minINR: 5000, maxINR: 7500, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    },
    {
      name: 'Dr. Vinod Raina',
      slug: 'dr-vinod-raina',
      hospital: fortis._id,
      specialization: 'Medical Oncology & Hematology',
      qualification: 'MBBS, MD, FRCP (Edinburgh), Ex-Head Medical Oncology AIIMS New Delhi',
      experience: 32,
      languages: ['English', 'Hindi', 'Kashmiri'],
      bio: 'One of India premier medical oncologists, performing specialized bone marrow transplants and clinical cancer immunotherapies for international patients.',
      consultationFee: { minUSD: 65, maxUSD: 85, minINR: 5000, maxINR: 7000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    },
    {
      name: 'Dr. Pradeep Chowbey',
      slug: 'dr-pradeep-chowbey',
      hospital: max._id,
      specialization: 'Minimal Access & Bariatric Surgery',
      qualification: 'MS, MNAMS, FICS, FACS (USA), Honorary Surgeon to the President of India',
      experience: 35,
      languages: ['English', 'Hindi'],
      bio: 'World authority in minimal access surgery and metabolic interventions, credited with pioneering laparoscopic techniques in the Asia-Pacific.',
      consultationFee: { minUSD: 55, maxUSD: 80, minINR: 4500, maxINR: 6500, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: false
    },
    {
      name: 'Dr. Sangeeta Gupta',
      slug: 'dr-sangeeta-gupta',
      hospital: manipal._id,
      specialization: 'Fertility & Reproductive Medicine',
      qualification: 'MBBS, DGO, DNB (Obstetrics & Gynecology), Fellowship in Reproductive Medicine (UK)',
      experience: 19,
      languages: ['English', 'Hindi', 'Kannada'],
      bio: 'Leading fertility specialist with high cumulative IVF/ICSI success rates, specializing in recurrent implantation failure and donor egg cycles for international couples.',
      consultationFee: { minUSD: 45, maxUSD: 70, minINR: 3500, maxINR: 5500, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1594824813580-5a3d7d8e8785?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    },
    {
      name: 'Dr. Ramakanta Panda',
      slug: 'dr-ramakanta-panda',
      hospital: kokilaben._id,
      specialization: 'Cardio-Thoracic Vascular Surgery',
      qualification: 'MCh (Cardiovascular Surgery), Cleveland Clinic Fellow (USA)',
      experience: 36,
      languages: ['English', 'Hindi', 'Odia', 'Marathi'],
      bio: 'Renowned as the surgeon with the "safest hands" in cardiac bypass, having performed over 24,000 complex coronary bypass surgeries with a 99.6% success rate.',
      consultationFee: { minUSD: 70, maxUSD: 100, minINR: 6000, maxINR: 8500, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    },
    {
      name: 'Dr. Subhash Gupta',
      slug: 'dr-subhash-gupta',
      hospital: max._id,
      specialization: 'Liver Transplantation & HPB Surgery',
      qualification: 'MS, FRCS (Glasgow), FRCS (Edinburgh), Queen Elizabeth Hospital Fellow',
      experience: 31,
      languages: ['English', 'Hindi'],
      bio: 'Pioneered living-donor liver transplantation in India, with over 3,000 liver transplants conducted for patients from more than 20 countries.',
      consultationFee: { minUSD: 65, maxUSD: 95, minINR: 5500, maxINR: 8000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    },
    {
      name: 'Dr. Sandeep Vaishya',
      slug: 'dr-sandeep-vaishya',
      hospital: fortis._id,
      specialization: 'Neurosciences & Spine Surgery',
      qualification: 'MBBS, MS, MCh (Neurosurgery AIIMS), Herbert Krause Medalist',
      experience: 26,
      languages: ['English', 'Hindi'],
      bio: 'Top neurosurgeon specializing in Gamma Knife Radiosurgery, minimally invasive spine surgery, and complex skull base tumor resections.',
      consultationFee: { minUSD: 55, maxUSD: 85, minINR: 4500, maxINR: 7000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: false
    },
    {
      name: 'Dr. Vidyasagar Chandankhede',
      slug: 'dr-vidyasagar-chandankhede',
      hospital: yashoda._id,
      specialization: 'Nephrology & Renal Transplant',
      qualification: 'MD, DM (Nephrology), FISN (Fellow of International Society of Nephrology)',
      experience: 21,
      languages: ['English', 'Hindi', 'Telugu'],
      bio: 'Expert in ABO-incompatible kidney transplants and robotic renal transplants with minimal immunosuppressive complication rates.',
      consultationFee: { minUSD: 50, maxUSD: 70, minINR: 4000, maxINR: 5500, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: false
    },
    {
      name: 'Dr. Ananya Iyer',
      slug: 'dr-ananya-iyer',
      hospital: apollo._id,
      specialization: 'Dental & Maxillofacial Rehabilitation',
      qualification: 'BDS, MDS (Prosthodontics & Implantology), Fellow ITI (Switzerland)',
      experience: 17,
      languages: ['English', 'Hindi', 'Tamil'],
      bio: 'Specialist in full-mouth All-on-4 dental implant restorations and computer-guided immediate aesthetic smile design for medical tourists.',
      consultationFee: { minUSD: 35, maxUSD: 50, minINR: 2500, maxINR: 4000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1594824813580-5a3d7d8e8785?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: false
    },
    {
      name: 'Dr. Harit Chaturvedi',
      slug: 'dr-harit-chaturvedi',
      hospital: artemis._id,
      specialization: 'Surgical Oncology',
      qualification: 'MBBS, MS, MCh (Surgical Oncology), Ex-Chief Cancer Surgeon AIIMS',
      experience: 27,
      languages: ['English', 'Hindi'],
      bio: 'Leads surgical oncology initiatives across South Asia, specializing in thoracic, gastrointestinal, and organ-preserving robotic cancer resections.',
      consultationFee: { minUSD: 60, maxUSD: 85, minINR: 5000, maxINR: 7000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: false
    },
    {
      name: 'Dr. G. Venkataswamy',
      slug: 'dr-g-venkataswamy',
      hospital: aster._id,
      specialization: 'Ophthalmology & Laser Eye Surgery',
      qualification: 'MS (Ophth), DO, Fellow Royal College of Surgeons (Glasgow)',
      experience: 22,
      languages: ['English', 'Hindi', 'Malayalam'],
      bio: 'Dedicated to advanced laser cataract surgery, premium multifocal lens implants, and international patient eye health retreats in Kerala.',
      consultationFee: { minUSD: 40, maxUSD: 60, minINR: 3000, maxINR: 5000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: false
    },
    {
      name: 'Dr. Balbir Singh',
      slug: 'dr-balbir-singh',
      hospital: max._id,
      specialization: 'Cardiology & Electrophysiology',
      qualification: 'MBBS, MD, DM, FACC, Padma Shri Awardee',
      experience: 29,
      languages: ['English', 'Hindi', 'Punjabi'],
      bio: 'Chairman of Cardiology and pacing specialist, pioneer in leadless pacemakers and complex cardiac electrophysiology mapping.',
      consultationFee: { minUSD: 60, maxUSD: 85, minINR: 5000, maxINR: 7000, currency: 'USD' },
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80',
      verificationStatus: 'verified',
      isAvailableForTeleconsult: true,
      featured: true
    }
  ]);

  // 4. Create Treatments (11 Treatments with realistic ranges and explicit disclaimers)
  console.log('[Seed] Creating 11 treatments with realistic estimated cost ranges and disclaimers...');
  const treatmentDocs = await Treatment.create([
    {
      name: 'Coronary Artery Bypass Graft (CABG)',
      slug: 'coronary-artery-bypass-graft',
      category: 'Cardiology',
      description: 'Surgical revascularization to restore normal blood flow to obstructed coronary arteries using minimally invasive or beating-heart techniques.',
      overview: 'Conducted by distinguished cardiothoracic teams with 99.2%+ success rate in hybrid operating suites equipped with ECMO and robotic assistance.',
      procedureInformation: 'General anesthesia; 3 to 5 hours surgery; artery or vein graft harvested from chest wall or leg and connected to bypass coronary blockage.',
      estimatedDuration: '3 - 5 hours surgical time',
      estimatedCostRange: {
        minUSD: 5500,
        maxUSD: 7500,
        minINR: 450000,
        maxINR: 620000,
        usaComparisonUSD: 125000,
        ukComparisonUSD: 42000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes. Final pricing depends on clinical evaluation and patient condition.'
      },
      recoveryInformation: '6 days inpatient hospital stay; 8-10 days outpatient recovery in India before fit-to-fly clinical certification.',
      savingsPercentage: 94,
      successRate: 99.2,
      popularCities: ['Chennai', 'Delhi NCR', 'Mumbai', 'Bengaluru'],
      relatedHospitals: [apollo._id, medanta._id, kokilaben._id],
      relatedDoctors: [doctorDocs[0]._id, doctorDocs[5]._id],
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Total Knee Replacement (Bilateral)',
      slug: 'total-knee-replacement-bilateral',
      category: 'Orthopedics',
      description: 'Complete resurfacing of both arthritic knee joints using FDA-approved titanium implants and robotic arm navigation for millimeter accuracy.',
      overview: 'Robotic-assisted joint replacement ensures faster rehabilitation, minimal soft-tissue damage, and walking within 24 hours post-operation.',
      procedureInformation: 'Spinal or epidural anesthesia; 2 to 3 hours total; robotic navigation system positions implants with sub-millimeter precision.',
      estimatedDuration: '2 - 3 hours surgical time',
      estimatedCostRange: {
        minUSD: 4800,
        maxUSD: 6500,
        minINR: 400000,
        maxINR: 540000,
        usaComparisonUSD: 48000,
        ukComparisonUSD: 22000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: '4 days inpatient hospital stay; 7-10 days supervised physical therapy in partner recovery suites.',
      savingsPercentage: 89,
      successRate: 98.7,
      popularCities: ['Delhi NCR', 'Chennai', 'Bengaluru', 'Hyderabad'],
      relatedHospitals: [medanta._id, fortis._id, manipal._id],
      relatedDoctors: [doctorDocs[1]._id],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Living Donor Liver Transplant',
      slug: 'living-donor-liver-transplant',
      category: 'Organ Transplants',
      description: 'Advanced hepatectomy and transplantation procedure where a portion of a healthy donor liver is transplanted into the patient.',
      overview: 'India has become the global capital for living-donor liver transplants, with clinical survival rates matching the best US transplant centers at a fraction of the cost.',
      procedureInformation: 'Dual operating teams working simultaneously for donor and recipient; high-end microvascular surgical anastomosis.',
      estimatedDuration: '8 - 12 hours surgical time',
      estimatedCostRange: {
        minUSD: 28000,
        maxUSD: 36000,
        minINR: 2300000,
        maxINR: 3000000,
        usaComparisonUSD: 340000,
        ukComparisonUSD: 160000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes. Requires pre-approved legal and clinical compatibility clearance.'
      },
      recoveryInformation: '15-20 days inpatient stay in specialized transplant ICU and isolation wing; 4 weeks follow-up.',
      savingsPercentage: 90,
      successRate: 92.5,
      popularCities: ['Delhi NCR', 'Chennai', 'Hyderabad'],
      relatedHospitals: [medanta._id, max._id, yashoda._id],
      relatedDoctors: [doctorDocs[6]._id],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Comprehensive IVF Cycle with ICSI',
      slug: 'comprehensive-ivf-icsi',
      category: 'Fertility & IVF',
      description: 'In Vitro Fertilization with Intracytoplasmic Sperm Injection, blastocyst culture, and pre-implantation genetic screening (PGT-A) support.',
      overview: 'State-of-the-art embryology cleanrooms with time-lapse embryo incubators and international surrogacy and fertility counselling.',
      procedureInformation: 'Ovarian stimulation, transvaginal egg retrieval under sedation, microscopic ICSI fertilization, and embryo transfer.',
      estimatedDuration: '2 - 3 weeks trip cycle',
      estimatedCostRange: {
        minUSD: 3200,
        maxUSD: 4500,
        minINR: 260000,
        maxINR: 375000,
        usaComparisonUSD: 24000,
        ukComparisonUSD: 12500,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: 'Outpatient procedure with zero hospital admission required; patient can relax and enjoy local sightseeing between monitoring visits.',
      savingsPercentage: 84,
      successRate: 72.0,
      popularCities: ['Bengaluru', 'Delhi NCR', 'Mumbai'],
      relatedHospitals: [manipal._id, max._id],
      relatedDoctors: [doctorDocs[4]._id],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'All-on-4 Full Mouth Dental Implants',
      slug: 'all-on-4-dental-implants',
      category: 'Dental Tourism',
      description: 'Permanent full-arch teeth replacement using 4 to 6 titanium dental implants and high-durability computer-milled zirconia prosthetics.',
      overview: 'Combine world-class cosmetic dentistry with a golden triangle or backwaters holiday while saving over 85% compared to North American dental rates.',
      procedureInformation: 'Local anesthesia; precision 3D CBCT guided implant placement followed by immediate provisional bridge fixation in 3 days.',
      estimatedDuration: '3 - 5 days total trip',
      estimatedCostRange: {
        minUSD: 3800,
        maxUSD: 5000,
        minINR: 310000,
        maxINR: 415000,
        usaComparisonUSD: 30000,
        ukComparisonUSD: 16000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: 'Outpatient procedure; mild soreness for 48 hours; immediate functional chewing capability.',
      savingsPercentage: 86,
      successRate: 98.0,
      popularCities: ['Delhi NCR', 'Chennai', 'Kochi', 'Mumbai'],
      relatedHospitals: [apollo._id, fortis._id],
      relatedDoctors: [doctorDocs[9]._id],
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'CyberKnife Robotic Radiosurgery',
      slug: 'cyberknife-radiosurgery',
      category: 'Oncology',
      description: 'Sub-millimeter robotic stereotactic radiation treatment delivering targeted beams to tumors throughout the body without surgical incisions.',
      overview: 'Pain-free outpatient cancer therapy allowing patients to maintain their everyday activities with zero hospital stay or general anesthesia.',
      procedureInformation: 'Targeted radiotherapy tracked in real time using robotic linear accelerator, compensating for patient breathing.',
      estimatedDuration: '1 to 5 treatment sessions (30-60 mins each)',
      estimatedCostRange: {
        minUSD: 6500,
        maxUSD: 8500,
        minINR: 540000,
        maxINR: 700000,
        usaComparisonUSD: 65000,
        ukComparisonUSD: 32000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: 'No post-operative recovery period; zero surgical incisions; immediate return to hotel accommodations.',
      savingsPercentage: 88,
      successRate: 94.0,
      popularCities: ['Delhi NCR', 'Chennai', 'Mumbai'],
      relatedHospitals: [fortis._id, apollo._id, kokilaben._id],
      relatedDoctors: [doctorDocs[2]._id, doctorDocs[7]._id],
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Spinal Fusion & Disc Replacement',
      slug: 'spinal-fusion-disc-replacement',
      category: 'Neurology & Spine',
      description: 'Minimally invasive decompression and artificial disc replacement or titanium rod stabilization for degenerative spine disorders.',
      overview: 'Performed with intraoperative neuromonitoring and robotic guidance to protect neural pathways and accelerate mobility.',
      procedureInformation: 'Keyhole surgical access to relieve compressed nerves and insert FDA-approved dynamic artificial disc.',
      estimatedDuration: '2 - 4 hours surgical time',
      estimatedCostRange: {
        minUSD: 6000,
        maxUSD: 8200,
        minINR: 500000,
        maxINR: 680000,
        usaComparisonUSD: 75000,
        ukComparisonUSD: 35000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: '3-4 days hospital stay; walking assisted on Day 2; fit-to-fly after 10-12 days.',
      savingsPercentage: 90,
      successRate: 96.5,
      popularCities: ['Delhi NCR', 'Bengaluru', 'Chennai'],
      relatedHospitals: [fortis._id, manipal._id],
      relatedDoctors: [doctorDocs[7]._id],
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Robotic Radical Prostatectomy',
      slug: 'robotic-radical-prostatectomy',
      category: 'Urology',
      description: 'High-precision removal of the prostate gland using the Da Vinci Xi robotic surgical system, preserving urinary continence and nerve pathways.',
      overview: 'World-class urologic oncology teams with low complication rates and minimal blood loss compared to conventional open surgery.',
      procedureInformation: 'Keyhole ports; 3D high-definition magnified visualization with articulating robotic micro-instruments.',
      estimatedDuration: '2 - 3 hours surgical time',
      estimatedCostRange: {
        minUSD: 7000,
        maxUSD: 9500,
        minINR: 580000,
        maxINR: 790000,
        usaComparisonUSD: 60000,
        ukComparisonUSD: 28000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: '2-3 days hospital admission; catheter removal after 7 days; flight clearance at 10-12 days.',
      savingsPercentage: 85,
      successRate: 97.2,
      popularCities: ['Delhi NCR', 'Hyderabad', 'Mumbai'],
      relatedHospitals: [medanta._id, yashoda._id, max._id],
      relatedDoctors: [doctorDocs[3]._id],
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Rhinoplasty & Facial Reconstruction',
      slug: 'rhinoplasty-facial-reconstruction',
      category: 'Cosmetic & Plastic Surgery',
      description: 'Aesthetic and functional nasal reshaping, septoplasty, and facial harmony contouring by board-certified plastic surgeons.',
      overview: 'Natural aesthetic outcomes with internal airway enhancement, performed in JCI accredited sterile cosmetic surgical suites.',
      procedureInformation: 'Closed or open rhinoplasty technique; structural cartilage grafting and bone repositioning.',
      estimatedDuration: '2 - 3 hours surgical time',
      estimatedCostRange: {
        minUSD: 2200,
        maxUSD: 3500,
        minINR: 180000,
        maxINR: 290000,
        usaComparisonUSD: 14000,
        ukComparisonUSD: 8000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: '1 day hospital observation; external splint removed on Day 7; light travel and sightseeing permitted.',
      savingsPercentage: 80,
      successRate: 98.0,
      popularCities: ['Delhi NCR', 'Mumbai', 'Chennai'],
      relatedHospitals: [max._id, kokilaben._id],
      relatedDoctors: [doctorDocs[3]._id],
      image: 'https://images.unsplash.com/photo-1512290900672-1f55b9e59d60?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Laser Refractive Cataract Surgery (Bilateral)',
      slug: 'laser-refractive-cataract-surgery',
      category: 'Ophthalmology',
      description: 'Femtosecond laser-assisted lens replacement with premium trifocal or extended depth-of-focus (EDOF) intraocular lenses.',
      overview: 'Freedom from reading glasses and distance spectacles, combined with tranquil Ayurvedic eye rejuvenation in Kerala.',
      procedureInformation: 'Bladeless laser corneal incisions; ultrasonic emulsification of cloudy lens; foldable IOL implantation.',
      estimatedDuration: '30 minutes per eye',
      estimatedCostRange: {
        minUSD: 1400,
        maxUSD: 2200,
        minINR: 115000,
        maxINR: 180000,
        usaComparisonUSD: 9500,
        ukComparisonUSD: 5500,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: 'Daycare outpatient procedure; immediate vision improvement; 4-day recovery holiday before flying home.',
      savingsPercentage: 83,
      successRate: 99.5,
      popularCities: ['Kochi', 'Chennai', 'Bengaluru'],
      relatedHospitals: [aster._id, apollo._id],
      relatedDoctors: [doctorDocs[11]._id],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Bilateral Cochlear Implantation',
      slug: 'bilateral-cochlear-implantation',
      category: 'Ophthalmology', // ENT category
      description: 'Advanced neuro-electronic device implantation for profound sensorineural hearing loss in children and adults.',
      overview: 'Comprehensive auditory mapping, surgical placement under neural monitoring, and personalized post-activation speech therapy.',
      procedureInformation: 'Mastoidectomy with facial recess approach; insertion of multi-channel electrode array into cochlea.',
      estimatedDuration: '3 - 4 hours surgical time',
      estimatedCostRange: {
        minUSD: 14000,
        maxUSD: 18000,
        minINR: 1150000,
        maxINR: 1500000,
        usaComparisonUSD: 90000,
        ukComparisonUSD: 45000,
        disclaimer: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes.'
      },
      recoveryInformation: '2 days hospital stay; initial device activation at 2 weeks with speech therapy orientation.',
      savingsPercentage: 82,
      successRate: 95.0,
      popularCities: ['Delhi NCR', 'Chennai', 'Bengaluru'],
      relatedHospitals: [fortis._id, apollo._id],
      relatedDoctors: [doctorDocs[0]._id],
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Link treatments back to hospitals
  console.log('[Seed] Linking treatments to hospitals...');
  for (const h of hospitalDocs) {
    const matchingTreatments = treatmentDocs
      .filter((t) => t.relatedHospitals.some((rh) => rh.toString() === h._id.toString()))
      .map((t) => t._id);

    if (matchingTreatments.length > 0) {
      h.treatments = matchingTreatments;
      await h.save();
    }
  }

  // 5. Create Several Reviews
  console.log('[Seed] Creating patient reviews...');
  await Review.create([
    {
      patient: patient._id,
      hospital: apollo._id,
      doctor: doctorDocs[0]._id,
      rating: 5,
      comment: 'Saved over £35,000 compared to private treatment in London. The cardiac team treated me like family. Back to golfing in 6 weeks!',
      moderationStatus: 'published',
      patientName: 'David Miller',
      patientCountry: 'United Kingdom',
      treatmentName: 'Coronary Artery Bypass (CABG)'
    },
    {
      patient: patient._id,
      hospital: medanta._id,
      doctor: doctorDocs[1]._id,
      rating: 5,
      comment: 'From the VIP airport pickup in Delhi to the luxury suite and Dr. Rajgopal surgical mastery, everything exceeded our expectations. Truly world-class.',
      moderationStatus: 'published',
      patientName: 'Khadija Al-Mansouri',
      patientCountry: 'United Arab Emirates',
      treatmentName: 'Robotic Knee Replacement'
    },
    {
      patient: patient._id,
      hospital: fortis._id,
      doctor: doctorDocs[2]._id,
      rating: 5,
      comment: 'Dr. Raina and the bone marrow transplant nursing team provided impeccable care. We felt supported at every single milestone.',
      moderationStatus: 'published',
      patientName: 'Oluwaseun Adebayo',
      patientCountry: 'Nigeria',
      treatmentName: 'Bone Marrow Transplant'
    },
    {
      patient: patient._id,
      hospital: kokilaben._id,
      doctor: doctorDocs[5]._id,
      rating: 5,
      comment: 'Dr. Panda performed a high-risk bypass that two centers in North America hesitated to take. I am fully recovered and energetic.',
      moderationStatus: 'published',
      patientName: 'Robert Vance',
      patientCountry: 'United States',
      treatmentName: 'Complex Beating-Heart Bypass'
    },
    {
      patient: patient._id,
      hospital: aster._id,
      doctor: doctorDocs[11]._id,
      rating: 5,
      comment: 'The laser cataract surgery was painless, and convalescing in Kochi by the backwaters was deeply soothing. A truly healing vacation.',
      moderationStatus: 'published',
      patientName: 'Elena Rostova',
      patientCountry: 'Russia',
      treatmentName: 'Laser Cataract Surgery'
    }
  ]);

  // 6. Create Several Demo Appointments
  console.log('[Seed] Creating demo appointments...');
  await Appointment.create([
    {
      patient: patient._id,
      doctor: doctorDocs[1]._id, // Dr. Ashok Rajgopal
      hospital: medanta._id,
      treatment: treatmentDocs[1]._id, // Knee replacement
      appointmentDate: new Date(Date.now() + 86400000 * 5),
      appointmentType: 'teleconsult',
      status: 'confirmed',
      notes: 'Patient inquiry regarding bilateral robotic knee replacement. Severe osteoarthritis stage IV.',
      meetingLink: 'https://telehealth.medvoyage.in/room/sarah-dr-rajgopal'
    },
    {
      patient: patient._id,
      doctor: doctorDocs[0]._id, // Dr. Ashwin Mehta
      hospital: apollo._id,
      treatment: treatmentDocs[0]._id, // CABG
      appointmentDate: new Date(Date.now() - 86400000 * 12),
      appointmentType: 'teleconsult',
      status: 'completed',
      notes: 'Initial cardiac telemetry evaluation completed. Cleared for joint surgery first.',
      meetingLink: 'https://telehealth.medvoyage.in/room/sarah-dr-mehta'
    },
    {
      patient: patient._id,
      doctor: doctorDocs[6]._id, // Dr. Subhash Gupta
      hospital: max._id,
      treatment: treatmentDocs[2]._id, // Liver transplant
      appointmentDate: new Date(Date.now() + 86400000 * 18),
      appointmentType: 'in_person',
      status: 'pending',
      notes: 'Consultation request for family member second opinion.'
    }
  ]);

  // 7. Create Several Consultation Requests
  console.log('[Seed] Creating consultation requests...');
  await Consultation.create([
    {
      patient: patient._id,
      hospital: medanta._id,
      doctor: doctorDocs[1]._id,
      treatment: treatmentDocs[1]._id,
      message: 'Hello Doctor, I have uploaded my X-rays and MRI DICOM files. Could you confirm if robotic bilateral replacement is viable for me?',
      preferredDate: new Date(Date.now() + 86400000 * 4),
      status: 'responded',
      response: 'Dear Sarah, reviewed your imaging. Bone density is good and alignment indicates you are an ideal candidate for MAKO robotic surgery. Looking forward to our call on the 29th.'
    },
    {
      patient: patient._id,
      hospital: fortis._id,
      doctor: doctorDocs[7]._id,
      treatment: treatmentDocs[6]._id,
      message: 'Inquiring regarding spinal disc replacement. How many days post-operation before I am permitted to take a long-haul flight back to the US?',
      preferredDate: new Date(Date.now() + 86400000 * 10),
      status: 'pending',
      response: ''
    },
    {
      patient: patient._id,
      hospital: apollo._id,
      doctor: doctorDocs[9]._id,
      treatment: treatmentDocs[4]._id,
      message: 'Looking for a full-arch All-on-4 dental implant quote for my husband during our trip in October.',
      preferredDate: new Date(Date.now() + 86400000 * 14),
      status: 'reviewed',
      response: 'Our dental implant coordinator will prepare an estimate and CBCT scan schedule upon your Delhi arrival.'
    }
  ]);

  // 8. Create Travel Plan
  console.log('[Seed] Creating patient travel plan...');
  await TravelPlan.create({
    patient: patient._id,
    destinationCity: 'Delhi NCR',
    arrivalDate: new Date(Date.now() + 86400000 * 14),
    departureDate: new Date(Date.now() + 86400000 * 28),
    accommodation: {
      type: 'hotel_4star',
      details: 'Crowne Plaza Today Gurugram - Executive Suite with medical recliner and wheelchair support.'
    },
    transport: {
      airportPickup: true,
      details: 'Chauffeur escort at DEL Terminal 3 Gate 5 directly to Medanta Guest Suites.'
    },
    hospital: medanta._id,
    treatment: treatmentDocs[1]._id,
    notes: 'Medical Visa (MED-1) approved by MEA. Flight AI 102 (JFK to DEL). Companion: husband James Jenkins.',
    status: 'confirmed'
  });

  // 9. Create Medical Documents
  console.log('[Seed] Creating patient medical documents...');
  await MedicalDocument.create([
    {
      patient: patient._id,
      documentType: 'scan',
      fileName: 'Bilateral Knee X-Ray & MRI Scans.pdf',
      fileUrl: 'secure_storage://docs/sarah_knee_mri_2026.pdf',
      fileSize: '4.8 MB',
      uploadDate: new Date(Date.now() - 86400000 * 6),
      visibility: 'patient_and_doctor',
      notes: 'High-resolution radiology DICOM conversion uploaded for Dr. Rajgopal evaluation.'
    },
    {
      patient: patient._id,
      documentType: 'visa_letter',
      fileName: 'Indian Medical Visa (MED-1) Invitation Letter.pdf',
      fileUrl: 'secure_storage://docs/sarah_med1_invitation.pdf',
      fileSize: '1.1 MB',
      uploadDate: new Date(Date.now() - 86400000 * 2),
      visibility: 'patient_and_doctor',
      notes: 'Official hospital letter stamped by Ministry of External Affairs for NYC Indian Consulate.'
    },
    {
      patient: patient._id,
      documentType: 'prescription',
      fileName: 'Pre-operative Assessment & Clearance Protocol.pdf',
      fileUrl: 'secure_storage://docs/sarah_preop_protocol.pdf',
      fileSize: '720 KB',
      uploadDate: new Date(Date.now() - 86400000 * 1),
      visibility: 'patient_and_doctor',
      notes: 'Guidelines on pre-flight fasting and medication pauses.'
    }
  ]);

  console.log('================================================================');
  console.log('  PROTOTYPE DATABASE SEEDED SUCCESSFULLY!');
  console.log('================================================================');
  console.log('  Hospitals:      9 accredited Indian centers');
  console.log('  Doctors:        13 experienced faculty surgeons');
  console.log('  Treatments:     11 procedures with realistic US/UK cost comparisons');
  console.log('  Reviews:        5 verified international patient stories');
  console.log('  Appointments:   3 demo appointments (confirmed, completed, pending)');
  console.log('  Consultations:  3 consultation inquiries with responses');
  console.log('  Travel Plan:    1 confirmed travel itinerary');
  console.log('  Documents:      3 secure medical document references');
  console.log('----------------------------------------------------------------');
  console.log('  LOCAL PROTOTYPE CREDENTIALS:');
  console.log('    Patient:   patient@example.com   / Password123!');
  console.log('    Provider:  provider@apollo.com   / Password123!');
  console.log('    Admin:     admin@medvoyage.in    / Password123!');
  console.log('================================================================');

  await mongoose.disconnect();
};

seedDatabase().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});

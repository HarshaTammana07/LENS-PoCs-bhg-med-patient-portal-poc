# SAMMS Enterprise Database - Master Tables Reference

> **Document Purpose**: This document provides a complete, structured catalog of all **1,906 tables** in the **SAMMS (Substance Abuse Management System)** production database for Behavioral Health Group (BHG). SAMMS is the certified Electronic Health Record (EHR) and dispensing management system supporting BHG’s ~120+ Opioid Treatment Programs (OTPs) across 21 states.

---

## Executive Summary & Schema Breakdown

The SAMMS production database contains **1,906 total tables** distributed across 4 schemas:

| Database Schema | Core Functional Domain | Table Count | Percentage |
| :--- | :--- | :---: | :---: |
| **`dbo`** | Core SAMMS Clinical, Dosing, Intake, Scheduling, Billing & Demographics | **1873** | 98.3% |
| **`cdc`** | SQL Server Change Data Capture (Database Replication & Transaction Audit) | **23** | 1.2% |
| **`rcm`** | Revenue Cycle Management, Claims Operations & Payer Workgroups | **5** | 0.3% |
| **`scx`** | System Security, Mobile Banners & Telemetry Analytics | **5** | 0.3% |
| **TOTAL** | **All Enterprise SAMMS Tables** | **1906** | **100%** |

> 💡 **Developer Note**: For the specific, field-by-field database mapping powering the BHG Patient and Clinician Portals, see [DATABASE_TABLE_MAPPING_GUIDE.md](../DATABASE_TABLE_MAPPING_GUIDE.md).

---

## 1. Core Clinical & Operational Tables (`dbo` Schema - 1,873 Tables)

### 1.1 Patient Demographics, Intake & Master Patient Index (MPI) (159 tables)
*Patient master records, client identifiers (M4ID), demographics, addresses, emergency contacts, and admission registration.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ACBHCSSmartCareClientContacts` | Clinical/operational entity in Patient Demographics |
| 2 | `dbo.ACBHCSSmartCareDemographicAndClientInfoTab` | Clinical/operational entity in Patient Demographics |
| 3 | `dbo.AddressMaster` | Clinical/operational entity in Patient Demographics |
| 4 | `dbo.AnnualReviewofPatient` | Clinical/operational entity in Patient Demographics |
| 5 | `dbo.BAARTVisaliaRegistrationCheck` | Clinical/operational entity in Patient Demographics |
| 6 | `dbo.BAARTVisaliaRegistrationCheckGridData` | Clinical/operational entity in Patient Demographics |
| 7 | `dbo.BenzodiazepineUsePatientEducationandAcknowledgment` | Clinical/operational entity in Patient Demographics |
| 8 | `dbo.CAMultipleRegistration` | Clinical/operational entity in Patient Demographics |
| 9 | `dbo.CAMultipleRegistrationProgram` | Clinical/operational entity in Patient Demographics |
| 10 | `dbo.CAPatientBillOfRights` | Clinical/operational entity in Patient Demographics |
| 11 | `dbo.CAPatientRightsandResponsibilitiesAddress` | Clinical/operational entity in Patient Demographics |
| 12 | `dbo.CITY CLIENTS from old db` | Clinical/operational entity in Patient Demographics |
| 13 | `dbo.CLINIC59_PATIENTMEDS` | Clinical/operational entity in Patient Demographics |
| 14 | `dbo.CTDemoGraphic` | Clinical/operational entity in Patient Demographics |
| 15 | `dbo.CentralRegistryClient` | Clinical/operational entity in Patient Demographics |
| 16 | `dbo.CentralRegistryClient_20241106004807` | Clinical/operational entity in Patient Demographics |
| 17 | `dbo.ClientCommunicationLog` | Clinical/operational entity in Patient Demographics |
| 18 | `dbo.ClientDischarge` | Clinical/operational entity in Patient Demographics |
| 19 | `dbo.ClientEducation` | Clinical/operational entity in Patient Demographics |
| 20 | `dbo.ClientFormMaster` | Clinical/operational entity in Patient Demographics |
| 21 | `dbo.ClientKardiaMapping` | Clinical/operational entity in Patient Demographics |
| 22 | `dbo.ClientMaster` | Clinical/operational entity in Patient Demographics |
| 23 | `dbo.ClientRegistration` | Clinical/operational entity in Patient Demographics |
| 24 | `dbo.ClientTransgender` | Clinical/operational entity in Patient Demographics |
| 25 | `dbo.ConfidentialInformationDualEnrollment` | Clinical/operational entity in Patient Demographics |
| 26 | `dbo.ConsentToDiscloseInfoMultipleRegistrationIL` | Clinical/operational entity in Patient Demographics |
| 27 | `dbo.ConsentToDiscloseInfoMultipleRegistrationNM` | Clinical/operational entity in Patient Demographics |
| 28 | `dbo.ConsentToDisclosureofPatientInfo` | Clinical/operational entity in Patient Demographics |
| 29 | `dbo.ConsentToPreventMultipleEnrollments` | Clinical/operational entity in Patient Demographics |
| 30 | `dbo.ConsentforDualEnrollment` | Clinical/operational entity in Patient Demographics |
| 31 | `dbo.ConsentforDualEnrollmentFaxNo` | Clinical/operational entity in Patient Demographics |
| 32 | `dbo.ConsenttoDisclosurePatientInformationProgram` | Clinical/operational entity in Patient Demographics |
| 33 | `dbo.ConsenttoDisclosurePatientInformationProgramAddress` | Clinical/operational entity in Patient Demographics |
| 34 | `dbo.ConsenttoDisclosureofPatientInformation` | Clinical/operational entity in Patient Demographics |
| 35 | `dbo.DAPPatientDetail` | Clinical/operational entity in Patient Demographics |
| 36 | `dbo.Demographics` | Clinical/operational entity in Patient Demographics |
| 37 | `dbo.Demography` | Clinical/operational entity in Patient Demographics |
| 38 | `dbo.DisenrollmentAssessment` | Clinical/operational entity in Patient Demographics |
| 39 | `dbo.DualEnrollmentAddress` | Clinical/operational entity in Patient Demographics |
| 40 | `dbo.DualEnrollmentCheckVanNess` | Clinical/operational entity in Patient Demographics |
| 41 | `dbo.DualEnrollmentSAACSHayward` | Clinical/operational entity in Patient Demographics |
| 42 | `dbo.DualEnrollmentSAACSStockton` | Clinical/operational entity in Patient Demographics |
| 43 | `dbo.DualEnrollmentclinic` | Clinical/operational entity in Patient Demographics |
| 44 | `dbo.EnrollmentAssessment ` | Clinical/operational entity in Patient Demographics |
| 45 | `dbo.FresnoDualEnrollmentclinic` | Clinical/operational entity in Patient Demographics |
| 46 | `dbo.FsnoDualEnrollment` | Clinical/operational entity in Patient Demographics |
| 47 | `dbo.GAFemalePatientOfChildBearingAge` | Clinical/operational entity in Patient Demographics |
| 48 | `dbo.ILConsentToDiscloseInfoMultipleRegistration` | Clinical/operational entity in Patient Demographics |
| 49 | `dbo.ILMultipleRegistrationProgram` | Clinical/operational entity in Patient Demographics |
| 50 | `dbo.INPatientCompliance` | Clinical/operational entity in Patient Demographics |
| 51 | `dbo.KSPatientRightsResponsibilities` | Clinical/operational entity in Patient Demographics |
| 52 | `dbo.KYPDMPPatientConsentForm` | Clinical/operational entity in Patient Demographics |
| 53 | `dbo.KYPatientRightsandResp` | Clinical/operational entity in Patient Demographics |
| 54 | `dbo.KYPatientRightsandRespoGrievanceAddress` | Clinical/operational entity in Patient Demographics |
| 55 | `dbo.LAPatientHandbookandOrientation` | Clinical/operational entity in Patient Demographics |
| 56 | `dbo.LAPatientHandbookandOrientationCountyPlan` | Clinical/operational entity in Patient Demographics |
| 57 | `dbo.MNCompAssesPatientInforamtion` | Clinical/operational entity in Patient Demographics |
| 58 | `dbo.MNPatientBillOfRights` | Clinical/operational entity in Patient Demographics |
| 59 | `dbo.MultipleRegistrationConsentV2` | Clinical/operational entity in Patient Demographics |
| 60 | `dbo.MultipleRegistrationConsentV2GridData` | Clinical/operational entity in Patient Demographics |
| 61 | `dbo.NEConsentforDualEnrollment` | Clinical/operational entity in Patient Demographics |
| 62 | `dbo.NMMultipleRegistrationProgram` | Clinical/operational entity in Patient Demographics |
| 63 | `dbo.NVConsentPreventMultipleEnrollments` | Clinical/operational entity in Patient Demographics |
| 64 | `dbo.NVConsentPreventMultipleEnrollmentsGridData` | Clinical/operational entity in Patient Demographics |
| 65 | `dbo.NVOutpatientScreening` | Clinical/operational entity in Patient Demographics |
| 66 | `dbo.NVPatientRights` | Clinical/operational entity in Patient Demographics |
| 67 | `dbo.OutpatientOrientationChecklist` | Clinical/operational entity in Patient Demographics |
| 68 | `dbo.OutpatientPreAdmission` | Clinical/operational entity in Patient Demographics |
| 69 | `dbo.OutpatientSUMHIntegratedAssessment` | Clinical/operational entity in Patient Demographics |
| 70 | `dbo.PatientAnnualReviewChecklist` | Clinical/operational entity in Patient Demographics |
| 71 | `dbo.PatientDependent` | Clinical/operational entity in Patient Demographics |
| 72 | `dbo.PatientEducationSignOffForm` | Clinical/operational entity in Patient Demographics |
| 73 | `dbo.PatientElectiontoSelfPay` | Clinical/operational entity in Patient Demographics |
| 74 | `dbo.PatientFeeScheduleHCRCMain` | Clinical/operational entity in Patient Demographics |
| 75 | `dbo.PatientFeeScheduleV3` | Clinical/operational entity in Patient Demographics |
| 76 | `dbo.PatientFinancialResponsibilityAgreement` | Clinical/operational entity in Patient Demographics |
| 77 | `dbo.PatientHealthInsuranceWaiver` | Clinical/operational entity in Patient Demographics |
| 78 | `dbo.PatientInformationSheet` | Clinical/operational entity in Patient Demographics |
| 79 | `dbo.PatientRefusalOfCare` | Clinical/operational entity in Patient Demographics |
| 80 | `dbo.PatientRightsAndResponsibilitiesV2` | Clinical/operational entity in Patient Demographics |
| 81 | `dbo.PatientRightsandResponsibilities` | Clinical/operational entity in Patient Demographics |
| 82 | `dbo.PatientSafetyPlan` | Clinical/operational entity in Patient Demographics |
| 83 | `dbo.PatientServiceReceipt` | Clinical/operational entity in Patient Demographics |
| 84 | `dbo.Patients` | Clinical/operational entity in Patient Demographics |
| 85 | `dbo.PatientsBillOfRight` | Clinical/operational entity in Patient Demographics |
| 86 | `dbo.PatientsHandBook` | Clinical/operational entity in Patient Demographics |
| 87 | `dbo.PreventMultipleEnrollmentsRevised` | Clinical/operational entity in Patient Demographics |
| 88 | `dbo.PreventMultipleEnrollmentsRevised_bak20241119` | Clinical/operational entity in Patient Demographics |
| 89 | `dbo.RICurrentCareEducationEnrollment` | Clinical/operational entity in Patient Demographics |
| 90 | `dbo.RIHealthHomePatientCenteredPlan` | Clinical/operational entity in Patient Demographics |
| 91 | `dbo.RNP_PatientProblems` | Clinical/operational entity in Patient Demographics |
| 92 | `dbo.RequirementToProvideNoticeToClient` | Clinical/operational entity in Patient Demographics |
| 93 | `dbo.SF_ClientMedicalDetails` | Clinical/operational entity in Patient Demographics |
| 94 | `dbo.SF_PATIENT_PRE_ADMISSION` | Clinical/operational entity in Patient Demographics |
| 95 | `dbo.SF_PatientGrievanceProcedure` | Clinical/operational entity in Patient Demographics |
| 96 | `dbo.SF_PatientIllicitSubstance` | Clinical/operational entity in Patient Demographics |
| 97 | `dbo.SF_PatientLegalPrescription` | Clinical/operational entity in Patient Demographics |
| 98 | `dbo.SF_PatientMedicalCondition` | Clinical/operational entity in Patient Demographics |
| 99 | `dbo.SF_PatientMedicalHistory` | Clinical/operational entity in Patient Demographics |
| 100 | `dbo.SF_PatientMedicalHistroy` | Clinical/operational entity in Patient Demographics |
| 101 | `dbo.SF_PatientPreAdmission` | Clinical/operational entity in Patient Demographics |
| 102 | `dbo.SF_PatientPreAdmissionReferralSource` | Clinical/operational entity in Patient Demographics |
| 103 | `dbo.SF_PatientPreAdmission_11182024` | Clinical/operational entity in Patient Demographics |
| 104 | `dbo.SF_PatientPreAdmission_OtherIllicit` | Clinical/operational entity in Patient Demographics |
| 105 | `dbo.SF_RegistrationMode` | Clinical/operational entity in Patient Demographics |
| 106 | `dbo.ScxClientActivityHistory` | Clinical/operational entity in Patient Demographics |
| 107 | `dbo.TNPatientEducationForm` | Clinical/operational entity in Patient Demographics |
| 108 | `dbo.TblClient_ForExport` | Clinical/operational entity in Patient Demographics |
| 109 | `dbo.WAMAforPregnantPatients` | Clinical/operational entity in Patient Demographics |
| 110 | `dbo.bkup_tblClientSFID` | Clinical/operational entity in Patient Demographics |
| 111 | `dbo.eRx_PatientPreferredPharmacy` | Clinical/operational entity in Patient Demographics |
| 112 | `dbo.tblCLIENTFORMS` | Clinical/operational entity in Patient Demographics |
| 113 | `dbo.tblCLIENTMED` | Clinical/operational entity in Patient Demographics |
| 114 | `dbo.tblCLIENTMEDREFILL` | Clinical/operational entity in Patient Demographics |
| 115 | `dbo.tblCLIENTMEDv4` | Clinical/operational entity in Patient Demographics |
| 116 | `dbo.tblCOMPLIANCEClient` | Clinical/operational entity in Patient Demographics |
| 117 | `dbo.tblCRIDPatient` | Clinical/operational entity in Patient Demographics |
| 118 | `dbo.tblClient` | Clinical/operational entity in Patient Demographics |
| 119 | `dbo.tblClientBkup20260313105323` | Clinical/operational entity in Patient Demographics |
| 120 | `dbo.tblClientBkup20260401200000` | Clinical/operational entity in Patient Demographics |
| 121 | `dbo.tblClientBkup20260501200000` | Clinical/operational entity in Patient Demographics |
| 122 | `dbo.tblClientBkup20260601200000` | Clinical/operational entity in Patient Demographics |
| 123 | `dbo.tblClientBkup20260701200000` | Clinical/operational entity in Patient Demographics |
| 124 | `dbo.tblClientBkup20260801200000` | Clinical/operational entity in Patient Demographics |
| 125 | `dbo.tblClientBkup20260901200000` | Clinical/operational entity in Patient Demographics |
| 126 | `dbo.tblClientCOPY` | Clinical/operational entity in Patient Demographics |
| 127 | `dbo.tblClientCustom` | Clinical/operational entity in Patient Demographics |
| 128 | `dbo.tblClientCustomData` | Clinical/operational entity in Patient Demographics |
| 129 | `dbo.tblClientDarts` | Clinical/operational entity in Patient Demographics |
| 130 | `dbo.tblClientDartsCOPY` | Clinical/operational entity in Patient Demographics |
| 131 | `dbo.tblClientDeleted` | Clinical/operational entity in Patient Demographics |
| 132 | `dbo.tblClientDemo` | Clinical/operational entity in Patient Demographics |
| 133 | `dbo.tblClientGuest` | Clinical/operational entity in Patient Demographics |
| 134 | `dbo.tblClientHx` | Clinical/operational entity in Patient Demographics |
| 135 | `dbo.tblClientInfoRequiredFields` | Clinical/operational entity in Patient Demographics |
| 136 | `dbo.tblClientMEDCHECK` | Clinical/operational entity in Patient Demographics |
| 137 | `dbo.tblClientMEDlog` | Clinical/operational entity in Patient Demographics |
| 138 | `dbo.tblClientMedPillCount` | Clinical/operational entity in Patient Demographics |
| 139 | `dbo.tblClientNOMS` | Clinical/operational entity in Patient Demographics |
| 140 | `dbo.tblClientSFInfo` | Clinical/operational entity in Patient Demographics |
| 141 | `dbo.tblClientServiceRate` | Clinical/operational entity in Patient Demographics |
| 142 | `dbo.tblClientServiceRateDefault` | Clinical/operational entity in Patient Demographics |
| 143 | `dbo.tblClient_bak10252024` | Clinical/operational entity in Patient Demographics |
| 144 | `dbo.tblConsentToDiscloseInfoMultipleRegistration` | Clinical/operational entity in Patient Demographics |
| 145 | `dbo.tblDartsDemogHistory` | Clinical/operational entity in Patient Demographics |
| 146 | `dbo.tblENROLL` | Clinical/operational entity in Patient Demographics |
| 147 | `dbo.tblENROLLDeletedhistory` | Clinical/operational entity in Patient Demographics |
| 148 | `dbo.tblENROLLhistory` | Clinical/operational entity in Patient Demographics |
| 149 | `dbo.tblEnroll_bk06052025` | Clinical/operational entity in Patient Demographics |
| 150 | `dbo.tblEnroll_bk06092025` | Clinical/operational entity in Patient Demographics |
| 151 | `dbo.tblEnroll_bk06172025` | Clinical/operational entity in Patient Demographics |
| 152 | `dbo.tblEnrollmentLog` | Clinical/operational entity in Patient Demographics |
| 153 | `dbo.tblEnrollmentSFInfo` | Clinical/operational entity in Patient Demographics |
| 154 | `dbo.tblMultipleRegistrationProgram` | Clinical/operational entity in Patient Demographics |
| 155 | `dbo.tblMultipleRegistrationProgramIL` | Clinical/operational entity in Patient Demographics |
| 156 | `dbo.tblMultipleRegistrationProgramMaint` | Clinical/operational entity in Patient Demographics |
| 157 | `dbo.tblPatientPhoneChangeLog` | Clinical/operational entity in Patient Demographics |
| 158 | `dbo.tblProgramMaintPatientInfo` | Clinical/operational entity in Patient Demographics |
| 159 | `dbo.tblScxClientSigContainer` | Clinical/operational entity in Patient Demographics |

### 1.2 Clinical Assessments, ASAM Criteria & Behavioral Health Diagnostics (562 tables)
*ASAM placement criteria (Dimensions 1-6), addiction severity (BAM), withdrawal scales (COWS), E&M documentation, psychiatric & biopsychosocial assessments, and suicide risk scales.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ACBHCSSmartCare` | Clinical/operational entity in Clinical Assessments |
| 2 | `dbo.ACBHCSSmartCareEpisodeTab` | Clinical/operational entity in Clinical Assessments |
| 3 | `dbo.ACBHCSSmartCareGeneralTab` | Clinical/operational entity in Clinical Assessments |
| 4 | `dbo.ACBHCSSmartCareProgramTab` | Clinical/operational entity in Clinical Assessments |
| 5 | `dbo.ACBHCSSmartCareSUD` | Clinical/operational entity in Clinical Assessments |
| 6 | `dbo.ACBHCSSmartCareSUDMedicalMentalHealthTab` | Clinical/operational entity in Clinical Assessments |
| 7 | `dbo.ACBHTobaccoUseAssessment` | Clinical/operational entity in Clinical Assessments |
| 8 | `dbo.AIMSScaleComparable` | Clinical/operational entity in Clinical Assessments |
| 9 | `dbo.ALASAMAdultAssessment` | Clinical/operational entity in Clinical Assessments |
| 10 | `dbo.ALASAMAdultAssessmentDimension1` | Clinical/operational entity in Clinical Assessments |
| 11 | `dbo.ALASAMAdultAssessmentDimension2` | Clinical/operational entity in Clinical Assessments |
| 12 | `dbo.ALASAMAdultAssessmentDimension3` | Clinical/operational entity in Clinical Assessments |
| 13 | `dbo.ALASAMAdultAssessmentDimension4` | Clinical/operational entity in Clinical Assessments |
| 14 | `dbo.ALASAMAdultAssessmentDimension5` | Clinical/operational entity in Clinical Assessments |
| 15 | `dbo.ALASAMAdultAssessmentDimension6` | Clinical/operational entity in Clinical Assessments |
| 16 | `dbo.ALASAMAssessment` | Clinical/operational entity in Clinical Assessments |
| 17 | `dbo.ALASAMAssessmentASAISData` | Clinical/operational entity in Clinical Assessments |
| 18 | `dbo.ALASAMAssessmentAssessment` | Clinical/operational entity in Clinical Assessments |
| 19 | `dbo.ALASAMAssessmentDProfile` | Clinical/operational entity in Clinical Assessments |
| 20 | `dbo.ALASAMAssessmentUncopeScreening` | Clinical/operational entity in Clinical Assessments |
| 21 | `dbo.ALUncopeScreeningElectronicVersion` | Clinical/operational entity in Clinical Assessments |
| 22 | `dbo.ASAMAssessmentSummary` | Clinical/operational entity in Clinical Assessments |
| 23 | `dbo.ASAMPlacementCriteriaVersionTwo` | Clinical/operational entity in Clinical Assessments |
| 24 | `dbo.AbuseHistories` | Clinical/operational entity in Clinical Assessments |
| 25 | `dbo.Addiction` | Clinical/operational entity in Clinical Assessments |
| 26 | `dbo.AdmissionAssessment` | Clinical/operational entity in Clinical Assessments |
| 27 | `dbo.AdmissionAssessmentAllergy` | Clinical/operational entity in Clinical Assessments |
| 28 | `dbo.AdmissionAssessmentDimensionFiveMentalStatusExam` | Clinical/operational entity in Clinical Assessments |
| 29 | `dbo.AdmissionAssessmentDimensionFiveSubstanceUse` | Clinical/operational entity in Clinical Assessments |
| 30 | `dbo.AdmissionAssessmentDimensionFour` | Clinical/operational entity in Clinical Assessments |
| 31 | `dbo.AdmissionAssessmentDimensionOneDetail` | Clinical/operational entity in Clinical Assessments |
| 32 | `dbo.AdmissionAssessmentDimensionOneDisorder` | Clinical/operational entity in Clinical Assessments |
| 33 | `dbo.AdmissionAssessmentDimensionOneSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 34 | `dbo.AdmissionAssessmentDimensionSix` | Clinical/operational entity in Clinical Assessments |
| 35 | `dbo.AdmissionAssessmentDimensionThree` | Clinical/operational entity in Clinical Assessments |
| 36 | `dbo.AdmissionAssessmentDimensionTwo` | Clinical/operational entity in Clinical Assessments |
| 37 | `dbo.AdmissionAssessmentMedication` | Clinical/operational entity in Clinical Assessments |
| 38 | `dbo.AdmissionAssessmentModifiedMINIScreen` | Clinical/operational entity in Clinical Assessments |
| 39 | `dbo.AdmissionAssessmentPractitioner` | Clinical/operational entity in Clinical Assessments |
| 40 | `dbo.AdmissionAssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 41 | `dbo.AdmissionAssessmentSummary` | Clinical/operational entity in Clinical Assessments |
| 42 | `dbo.AdmissionAssessmentTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 43 | `dbo.AdmissionDischargeDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 44 | `dbo.AdmissionPhysicalHistoryDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 45 | `dbo.AdmissionPhysicalHistorySubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 46 | `dbo.AdmissionScreeningForm` | Clinical/operational entity in Clinical Assessments |
| 47 | `dbo.AdmissionScreeningFormAllergy` | Clinical/operational entity in Clinical Assessments |
| 48 | `dbo.AdmissionScreeningFormMHPractitioner` | Clinical/operational entity in Clinical Assessments |
| 49 | `dbo.AdmissionScreeningFormOTCMedication` | Clinical/operational entity in Clinical Assessments |
| 50 | `dbo.AdmissionScreeningFormPregnancy` | Clinical/operational entity in Clinical Assessments |
| 51 | `dbo.AdmissionScreeningFormPrescribedMedication` | Clinical/operational entity in Clinical Assessments |
| 52 | `dbo.AdmissionScreeningFormSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 53 | `dbo.AdmissionScreeningFormTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 54 | `dbo.AdultAsam` | Clinical/operational entity in Clinical Assessments |
| 55 | `dbo.AdultAsamDimension1` | Clinical/operational entity in Clinical Assessments |
| 56 | `dbo.AdultAsamDimension2` | Clinical/operational entity in Clinical Assessments |
| 57 | `dbo.AdultAsamDimension3` | Clinical/operational entity in Clinical Assessments |
| 58 | `dbo.AdultAsamDimension4` | Clinical/operational entity in Clinical Assessments |
| 59 | `dbo.AdultAsamDimension5` | Clinical/operational entity in Clinical Assessments |
| 60 | `dbo.AdultAsamDimension6` | Clinical/operational entity in Clinical Assessments |
| 61 | `dbo.AdultAsamDimensionMedication` | Clinical/operational entity in Clinical Assessments |
| 62 | `dbo.AdultNutritionalScreen` | Clinical/operational entity in Clinical Assessments |
| 63 | `dbo.AdultSUDLevelAssessment` | Clinical/operational entity in Clinical Assessments |
| 64 | `dbo.AdultSUDLevelAssessmentDimension1` | Clinical/operational entity in Clinical Assessments |
| 65 | `dbo.AdultSUDLevelAssessmentDimension2` | Clinical/operational entity in Clinical Assessments |
| 66 | `dbo.AdultSUDLevelAssessmentDimension3` | Clinical/operational entity in Clinical Assessments |
| 67 | `dbo.AdultSUDLevelAssessmentDimension4` | Clinical/operational entity in Clinical Assessments |
| 68 | `dbo.AdultSUDLevelAssessmentDimension5` | Clinical/operational entity in Clinical Assessments |
| 69 | `dbo.AdultSUDLevelAssessmentDimension6` | Clinical/operational entity in Clinical Assessments |
| 70 | `dbo.AdultSUDLevelAssessmentPlacementSummary` | Clinical/operational entity in Clinical Assessments |
| 71 | `dbo.AlcoholAssessment` | Clinical/operational entity in Clinical Assessments |
| 72 | `dbo.AlcoholScreeningandRiskAssessmentForm` | Clinical/operational entity in Clinical Assessments |
| 73 | `dbo.Allergy` | Clinical/operational entity in Clinical Assessments |
| 74 | `dbo.AsamPlacement` | Clinical/operational entity in Clinical Assessments |
| 75 | `dbo.AsamReAssessmentReview` | Clinical/operational entity in Clinical Assessments |
| 76 | `dbo.AssesmentDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 77 | `dbo.AssessmentAllergy` | Clinical/operational entity in Clinical Assessments |
| 78 | `dbo.AssessmentCurrentMedication` | Clinical/operational entity in Clinical Assessments |
| 79 | `dbo.AssessmentFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 80 | `dbo.AssessmentMasterProblems` | Clinical/operational entity in Clinical Assessments |
| 81 | `dbo.AssessmentMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 82 | `dbo.AssessmentPastMedication` | Clinical/operational entity in Clinical Assessments |
| 83 | `dbo.AssessmentPastWorkHistory` | Clinical/operational entity in Clinical Assessments |
| 84 | `dbo.AssessmentPractitioners` | Clinical/operational entity in Clinical Assessments |
| 85 | `dbo.AssessmentPregnancyHistory` | Clinical/operational entity in Clinical Assessments |
| 86 | `dbo.AssessmentSNAP` | Clinical/operational entity in Clinical Assessments |
| 87 | `dbo.AssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 88 | `dbo.AssessmentTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 89 | `dbo.Assessments` | Clinical/operational entity in Clinical Assessments |
| 90 | `dbo.BAMForm` | Clinical/operational entity in Clinical Assessments |
| 91 | `dbo.BAMScore` | Clinical/operational entity in Clinical Assessments |
| 92 | `dbo.CalOMSAdministrativeDischarge` | Clinical/operational entity in Clinical Assessments |
| 93 | `dbo.CalOMSAdmission` | Clinical/operational entity in Clinical Assessments |
| 94 | `dbo.CalOMSDischarge` | Clinical/operational entity in Clinical Assessments |
| 95 | `dbo.CalOMSDischargeNew` | Clinical/operational entity in Clinical Assessments |
| 96 | `dbo.CalomsAnnual` | Clinical/operational entity in Clinical Assessments |
| 97 | `dbo.CalomsDischargeQuestionnaire` | Clinical/operational entity in Clinical Assessments |
| 98 | `dbo.ComprehensiveAssessmentForm` | Clinical/operational entity in Clinical Assessments |
| 99 | `dbo.ComprehensiveAssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 100 | `dbo.ComprehensiveAssessmentUpdate` | Clinical/operational entity in Clinical Assessments |
| 101 | `dbo.ConfidentialityofAlcoholandDrugAbuse` | Clinical/operational entity in Clinical Assessments |
| 102 | `dbo.ConsentAcknowledgementTelehealth` | Clinical/operational entity in Clinical Assessments |
| 103 | `dbo.ConsentCentralRegistryAlabama` | Clinical/operational entity in Clinical Assessments |
| 104 | `dbo.ConsentandScreenFTST` | Clinical/operational entity in Clinical Assessments |
| 105 | `dbo.ConsenttoReleaseInformationtotheHealthDepartmentRevised` | Clinical/operational entity in Clinical Assessments |
| 106 | `dbo.ConsenttoTreatmentViaTelehealth` | Clinical/operational entity in Clinical Assessments |
| 107 | `dbo.CountyOfLossAngelesPublicHealthSAPCList` | Clinical/operational entity in Clinical Assessments |
| 108 | `dbo.DAPAssessment` | Clinical/operational entity in Clinical Assessments |
| 109 | `dbo.DSMIVDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 110 | `dbo.DTPFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 111 | `dbo.DTPFormSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 112 | `dbo.Diagnosis` | Clinical/operational entity in Clinical Assessments |
| 113 | `dbo.DiagnosticCriteriaGrid` | Clinical/operational entity in Clinical Assessments |
| 114 | `dbo.Dimension1` | Clinical/operational entity in Clinical Assessments |
| 115 | `dbo.Dimension2` | Clinical/operational entity in Clinical Assessments |
| 116 | `dbo.Dimension3` | Clinical/operational entity in Clinical Assessments |
| 117 | `dbo.Dimension4` | Clinical/operational entity in Clinical Assessments |
| 118 | `dbo.Dimension5` | Clinical/operational entity in Clinical Assessments |
| 119 | `dbo.Dimension6` | Clinical/operational entity in Clinical Assessments |
| 120 | `dbo.Dimensions` | Clinical/operational entity in Clinical Assessments |
| 121 | `dbo.DischargeFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 122 | `dbo.DischargeSubstanceHistory` | Clinical/operational entity in Clinical Assessments |
| 123 | `dbo.DischargeSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 124 | `dbo.DischargeSummaryFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 125 | `dbo.DischargeSummarySubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 126 | `dbo.DischargeSummaryTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 127 | `dbo.DynamicIntakeForm` | Clinical/operational entity in Clinical Assessments |
| 128 | `dbo.EKGReferralFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 129 | `dbo.ETSAssessmentPrescriptionMedications` | Clinical/operational entity in Clinical Assessments |
| 130 | `dbo.ETS_SubstanceHistory` | Clinical/operational entity in Clinical Assessments |
| 131 | `dbo.EanDMcodelist_bak_10252024` | Clinical/operational entity in Clinical Assessments |
| 132 | `dbo.EandMCPTCode` | Clinical/operational entity in Clinical Assessments |
| 133 | `dbo.EandMCodeList` | Clinical/operational entity in Clinical Assessments |
| 134 | `dbo.EandMCodeRule` | Clinical/operational entity in Clinical Assessments |
| 135 | `dbo.EandMForm` | Clinical/operational entity in Clinical Assessments |
| 136 | `dbo.EandMFormAllergies` | Clinical/operational entity in Clinical Assessments |
| 137 | `dbo.EandMFormAnnualJustification` | Clinical/operational entity in Clinical Assessments |
| 138 | `dbo.EandMFormAssessmentPlanRecommendation` | Clinical/operational entity in Clinical Assessments |
| 139 | `dbo.EandMFormConfiguration` | Clinical/operational entity in Clinical Assessments |
| 140 | `dbo.EandMFormCurrentMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 141 | `dbo.EandMFormCurrentPrescribedMedication` | Clinical/operational entity in Clinical Assessments |
| 142 | `dbo.EandMFormCurrentRxOrder` | Clinical/operational entity in Clinical Assessments |
| 143 | `dbo.EandMFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 144 | `dbo.EandMFormDocumentation` | Clinical/operational entity in Clinical Assessments |
| 145 | `dbo.EandMFormDoseReview` | Clinical/operational entity in Clinical Assessments |
| 146 | `dbo.EandMFormFamilyHistories` | Clinical/operational entity in Clinical Assessments |
| 147 | `dbo.EandMFormFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 148 | `dbo.EandMFormIntervalHistory` | Clinical/operational entity in Clinical Assessments |
| 149 | `dbo.EandMFormMDM` | Clinical/operational entity in Clinical Assessments |
| 150 | `dbo.EandMFormMedAllergies` | Clinical/operational entity in Clinical Assessments |
| 151 | `dbo.EandMFormMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 152 | `dbo.EandMFormMedicalProviderDocumentation` | Clinical/operational entity in Clinical Assessments |
| 153 | `dbo.EandMFormObotStabilty` | Clinical/operational entity in Clinical Assessments |
| 154 | `dbo.EandMFormPMP` | Clinical/operational entity in Clinical Assessments |
| 155 | `dbo.EandMFormPastMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 156 | `dbo.EandMFormPastPrescribedMedication` | Clinical/operational entity in Clinical Assessments |
| 157 | `dbo.EandMFormPhysicalExam` | Clinical/operational entity in Clinical Assessments |
| 158 | `dbo.EandMFormPregnancy` | Clinical/operational entity in Clinical Assessments |
| 159 | `dbo.EandMFormPregnancyHistory` | Clinical/operational entity in Clinical Assessments |
| 160 | `dbo.EandMFormPregnancyResult` | Clinical/operational entity in Clinical Assessments |
| 161 | `dbo.EandMFormPriorSubstanceUseTreatment` | Clinical/operational entity in Clinical Assessments |
| 162 | `dbo.EandMFormReview` | Clinical/operational entity in Clinical Assessments |
| 163 | `dbo.EandMFormReviewOfSystem` | Clinical/operational entity in Clinical Assessments |
| 164 | `dbo.EandMFormSochxhpi` | Clinical/operational entity in Clinical Assessments |
| 165 | `dbo.EandMFormSocialHistory` | Clinical/operational entity in Clinical Assessments |
| 166 | `dbo.EandMFormSows` | Clinical/operational entity in Clinical Assessments |
| 167 | `dbo.EandMFormSubstanceUse` | Clinical/operational entity in Clinical Assessments |
| 168 | `dbo.EandMFormSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 169 | `dbo.EandMFormTelehealth` | Clinical/operational entity in Clinical Assessments |
| 170 | `dbo.EandMFormUALabResult` | Clinical/operational entity in Clinical Assessments |
| 171 | `dbo.EandMFormVital` | Clinical/operational entity in Clinical Assessments |
| 172 | `dbo.EandMPriorSubstanceUseTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 173 | `dbo.EandMServiceConfig` | Clinical/operational entity in Clinical Assessments |
| 174 | `dbo.ElDoradoASAM` | Clinical/operational entity in Clinical Assessments |
| 175 | `dbo.EmploymentHistory` | Clinical/operational entity in Clinical Assessments |
| 176 | `dbo.EmploymentHistoryFinancialApplication` | Clinical/operational entity in Clinical Assessments |
| 177 | `dbo.EmploymentHistoryReAssessment` | Clinical/operational entity in Clinical Assessments |
| 178 | `dbo.EvaluationAndManagement_Diagnosis` | Clinical/operational entity in Clinical Assessments |
| 179 | `dbo.EvaluationAndManagement_IntakeHistoryPrescription` | Clinical/operational entity in Clinical Assessments |
| 180 | `dbo.EvaluationAndManagement_SubstanceHistory` | Clinical/operational entity in Clinical Assessments |
| 181 | `dbo.ExtendedAbsenceAssessment` | Clinical/operational entity in Clinical Assessments |
| 182 | `dbo.FamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 183 | `dbo.FamilyandrecoveryenvironmentAssessment` | Clinical/operational entity in Clinical Assessments |
| 184 | `dbo.FlexcareScreen` | Clinical/operational entity in Clinical Assessments |
| 185 | `dbo.FresnoSUDAssessment` | Clinical/operational entity in Clinical Assessments |
| 186 | `dbo.FresnoSUDAssessmentD1` | Clinical/operational entity in Clinical Assessments |
| 187 | `dbo.FresnoSUDAssessmentD2` | Clinical/operational entity in Clinical Assessments |
| 188 | `dbo.FresnoSUDAssessmentD3` | Clinical/operational entity in Clinical Assessments |
| 189 | `dbo.FresnoSUDAssessmentD4` | Clinical/operational entity in Clinical Assessments |
| 190 | `dbo.FresnoSUDAssessmentD5` | Clinical/operational entity in Clinical Assessments |
| 191 | `dbo.FresnoSUDAssessmentD6` | Clinical/operational entity in Clinical Assessments |
| 192 | `dbo.FresnoSUDAssessmentLOCSummary` | Clinical/operational entity in Clinical Assessments |
| 193 | `dbo.FresnoSUDAssessmentPSummary` | Clinical/operational entity in Clinical Assessments |
| 194 | `dbo.FresnoSUDAssessmentSUH` | Clinical/operational entity in Clinical Assessments |
| 195 | `dbo.FresnoSUDUpdatedAssessment` | Clinical/operational entity in Clinical Assessments |
| 196 | `dbo.FresnoSUDUpdatedAssessmentD1` | Clinical/operational entity in Clinical Assessments |
| 197 | `dbo.FresnoSUDUpdatedAssessmentD2` | Clinical/operational entity in Clinical Assessments |
| 198 | `dbo.FresnoSUDUpdatedAssessmentD3` | Clinical/operational entity in Clinical Assessments |
| 199 | `dbo.FresnoSUDUpdatedAssessmentD4` | Clinical/operational entity in Clinical Assessments |
| 200 | `dbo.FresnoSUDUpdatedAssessmentD5` | Clinical/operational entity in Clinical Assessments |
| 201 | `dbo.FresnoSUDUpdatedAssessmentD6` | Clinical/operational entity in Clinical Assessments |
| 202 | `dbo.FresnoSUDUpdatedAssessmentLOCSummary` | Clinical/operational entity in Clinical Assessments |
| 203 | `dbo.FresnoSUDUpdatedAssessmentPSummary` | Clinical/operational entity in Clinical Assessments |
| 204 | `dbo.FresnoSUDUpdatedAssessmentSUH` | Clinical/operational entity in Clinical Assessments |
| 205 | `dbo.FullASAMAssessmentPlacementsummary` | Clinical/operational entity in Clinical Assessments |
| 206 | `dbo.FullAsamAssesmentDiagnosisCriteria` | Clinical/operational entity in Clinical Assessments |
| 207 | `dbo.FullAsamAssesmentDimension1` | Clinical/operational entity in Clinical Assessments |
| 208 | `dbo.FullAsamAssesmentDimension2` | Clinical/operational entity in Clinical Assessments |
| 209 | `dbo.FullAsamAssesmentDimension3` | Clinical/operational entity in Clinical Assessments |
| 210 | `dbo.FullAsamAssesmentDimension4` | Clinical/operational entity in Clinical Assessments |
| 211 | `dbo.FullAsamAssesmentDimension5` | Clinical/operational entity in Clinical Assessments |
| 212 | `dbo.FullAsamAssesmentDimension6` | Clinical/operational entity in Clinical Assessments |
| 213 | `dbo.FullAsamAssesmentLocTool` | Clinical/operational entity in Clinical Assessments |
| 214 | `dbo.FullAsamAssessment` | Clinical/operational entity in Clinical Assessments |
| 215 | `dbo.FullAsamAssessmentCurrentMedication` | Clinical/operational entity in Clinical Assessments |
| 216 | `dbo.FullAsamAssessmentOtherProviders` | Clinical/operational entity in Clinical Assessments |
| 217 | `dbo.FullAsamAssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 218 | `dbo.FullAsamAssessmentTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 219 | `dbo.GPRADiagnosis` | Clinical/operational entity in Clinical Assessments |
| 220 | `dbo.HealthCareResourceCenterEnglish` | Clinical/operational entity in Clinical Assessments |
| 221 | `dbo.HealthCareResourceCenterSpanish` | Clinical/operational entity in Clinical Assessments |
| 222 | `dbo.HealthQuestionareAllergy` | Clinical/operational entity in Clinical Assessments |
| 223 | `dbo.HealthQuestionareFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 224 | `dbo.HealthQuestionareImmunization` | Clinical/operational entity in Clinical Assessments |
| 225 | `dbo.HealthQuestionareMedication` | Clinical/operational entity in Clinical Assessments |
| 226 | `dbo.HealthQuestionareVital` | Clinical/operational entity in Clinical Assessments |
| 227 | `dbo.HealthQuestionnaire` | Clinical/operational entity in Clinical Assessments |
| 228 | `dbo.HealthQuestionnaireCardiacRisk` | Clinical/operational entity in Clinical Assessments |
| 229 | `dbo.HealthQuestionnaireFamilyHistoryGrid` | Clinical/operational entity in Clinical Assessments |
| 230 | `dbo.HealthQuestionnaireGeneral` | Clinical/operational entity in Clinical Assessments |
| 231 | `dbo.HealthQuestionnaireIllnessHistory` | Clinical/operational entity in Clinical Assessments |
| 232 | `dbo.HealthQuestionnaireInstruction` | Clinical/operational entity in Clinical Assessments |
| 233 | `dbo.HealthQuestionnaireMentalStatus` | Clinical/operational entity in Clinical Assessments |
| 234 | `dbo.HealthQuestionnairePainAssessment` | Clinical/operational entity in Clinical Assessments |
| 235 | `dbo.HealthQuestionnairePastHistory` | Clinical/operational entity in Clinical Assessments |
| 236 | `dbo.HealthQuestionnairePregnancy` | Clinical/operational entity in Clinical Assessments |
| 237 | `dbo.HealthQuestionnaireTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 238 | `dbo.IDDFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 239 | `dbo.INInitialAssessment` | Clinical/operational entity in Clinical Assessments |
| 240 | `dbo.INPositiveDrugScreenReview` | Clinical/operational entity in Clinical Assessments |
| 241 | `dbo.ImpairmentAssessmentTool` | Clinical/operational entity in Clinical Assessments |
| 242 | `dbo.IncarcerationHistory` | Clinical/operational entity in Clinical Assessments |
| 243 | `dbo.InfectiousDiseaseAndBehavioralScreen` | Clinical/operational entity in Clinical Assessments |
| 244 | `dbo.InitialAssessment` | Clinical/operational entity in Clinical Assessments |
| 245 | `dbo.InitialCompAssesBehavioralHealthHistory` | Clinical/operational entity in Clinical Assessments |
| 246 | `dbo.InitialCompAssesBehavioralHelthPsychiatricHistory` | Clinical/operational entity in Clinical Assessments |
| 247 | `dbo.InitialCompAssesLegalHistory` | Clinical/operational entity in Clinical Assessments |
| 248 | `dbo.InitialCompAssesLegalHistoryCharges` | Clinical/operational entity in Clinical Assessments |
| 249 | `dbo.InitialCompAssesMaritalHistory` | Clinical/operational entity in Clinical Assessments |
| 250 | `dbo.InitialCompAssesMedicalBehavioralHistory` | Clinical/operational entity in Clinical Assessments |
| 251 | `dbo.InitialCompAssesMedicalBehavioralHistoryCurrentMedicalCondition` | Clinical/operational entity in Clinical Assessments |
| 252 | `dbo.InitialCompAssesMedicalBehavioralHistoryCurrentMedications` | Clinical/operational entity in Clinical Assessments |
| 253 | `dbo.InitialCompAssesMedicalBehavioralHistoryPastMedicalCondition` | Clinical/operational entity in Clinical Assessments |
| 254 | `dbo.InitialCompAssesMedicalBehavioralHistoryPastMedications` | Clinical/operational entity in Clinical Assessments |
| 255 | `dbo.InitialCompAssesMilitryHistory` | Clinical/operational entity in Clinical Assessments |
| 256 | `dbo.InitialCompAssesOccupationalHistory` | Clinical/operational entity in Clinical Assessments |
| 257 | `dbo.InitialCompAssesOccupationalWorkHistory` | Clinical/operational entity in Clinical Assessments |
| 258 | `dbo.InitialCompAssesSubstanceAbuse` | Clinical/operational entity in Clinical Assessments |
| 259 | `dbo.InitialCompAssesTraumaHistory` | Clinical/operational entity in Clinical Assessments |
| 260 | `dbo.InitialComprehensiveAssessment` | Clinical/operational entity in Clinical Assessments |
| 261 | `dbo.InitialDiagnosisDetermination` | Clinical/operational entity in Clinical Assessments |
| 262 | `dbo.IntakeFormService` | Clinical/operational entity in Clinical Assessments |
| 263 | `dbo.IntakeFormService_bk03192025` | Clinical/operational entity in Clinical Assessments |
| 264 | `dbo.IntakeFormStandard` | Clinical/operational entity in Clinical Assessments |
| 265 | `dbo.IntakeFormsMenu` | Clinical/operational entity in Clinical Assessments |
| 266 | `dbo.IntakeFormsMenu_bak01172023` | Clinical/operational entity in Clinical Assessments |
| 267 | `dbo.IntakeFormsMenu_bak06142026` | Clinical/operational entity in Clinical Assessments |
| 268 | `dbo.IntakeFormsNotes` | Clinical/operational entity in Clinical Assessments |
| 269 | `dbo.IntakePacketTypes` | Clinical/operational entity in Clinical Assessments |
| 270 | `dbo.LOCPAFormDimension1` | Clinical/operational entity in Clinical Assessments |
| 271 | `dbo.LOCPAFormDimension2` | Clinical/operational entity in Clinical Assessments |
| 272 | `dbo.LOCPAFormDimension3` | Clinical/operational entity in Clinical Assessments |
| 273 | `dbo.LOCPAFormDimension4` | Clinical/operational entity in Clinical Assessments |
| 274 | `dbo.LOCPAFormDimension5` | Clinical/operational entity in Clinical Assessments |
| 275 | `dbo.LOCPAFormDimension6` | Clinical/operational entity in Clinical Assessments |
| 276 | `dbo.LOCPAFormSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 277 | `dbo.LegalHistory` | Clinical/operational entity in Clinical Assessments |
| 278 | `dbo.MATHistoryPhysicalDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 279 | `dbo.MATHistoryPhysicalSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 280 | `dbo.MDHealthHomeInformedConsent` | Clinical/operational entity in Clinical Assessments |
| 281 | `dbo.MDHealthHomeNote` | Clinical/operational entity in Clinical Assessments |
| 282 | `dbo.MDHealthHomeParticipantIntake` | Clinical/operational entity in Clinical Assessments |
| 283 | `dbo.MIASAMAuthorizationForm` | Clinical/operational entity in Clinical Assessments |
| 284 | `dbo.MIAssessmentforWDC` | Clinical/operational entity in Clinical Assessments |
| 285 | `dbo.MICommunicableDiseaseScreening` | Clinical/operational entity in Clinical Assessments |
| 286 | `dbo.MIFASScreen` | Clinical/operational entity in Clinical Assessments |
| 287 | `dbo.MIFASScreenCheckGridData` | Clinical/operational entity in Clinical Assessments |
| 288 | `dbo.MNComprehensiveAssessment` | Clinical/operational entity in Clinical Assessments |
| 289 | `dbo.MNComprehensiveAssessmentDimentionFive` | Clinical/operational entity in Clinical Assessments |
| 290 | `dbo.MNComprehensiveAssessmentDimentionFour` | Clinical/operational entity in Clinical Assessments |
| 291 | `dbo.MNComprehensiveAssessmentDimentionOne` | Clinical/operational entity in Clinical Assessments |
| 292 | `dbo.MNComprehensiveAssessmentDimentionSix` | Clinical/operational entity in Clinical Assessments |
| 293 | `dbo.MNComprehensiveAssessmentDimentionThree` | Clinical/operational entity in Clinical Assessments |
| 294 | `dbo.MNComprehensiveAssessmentDimentionTwo` | Clinical/operational entity in Clinical Assessments |
| 295 | `dbo.MNComprehensiveAssessmentEducationalHistory` | Clinical/operational entity in Clinical Assessments |
| 296 | `dbo.MNComprehensiveAssessmentFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 297 | `dbo.MNComprehensiveAssessmentFamilyhelthHistory` | Clinical/operational entity in Clinical Assessments |
| 298 | `dbo.MNComprehensiveAssessmentLegalHistory` | Clinical/operational entity in Clinical Assessments |
| 299 | `dbo.MNComprehensiveAssessmentLevelOfCare` | Clinical/operational entity in Clinical Assessments |
| 300 | `dbo.MNComprehensiveAssessmentMedication` | Clinical/operational entity in Clinical Assessments |
| 301 | `dbo.MNComprehensiveAssessmentOccupationalHistory` | Clinical/operational entity in Clinical Assessments |
| 302 | `dbo.MNComprehensiveAssessmentSexualHistory` | Clinical/operational entity in Clinical Assessments |
| 303 | `dbo.MNComprehensiveAssessmentSocialHistory` | Clinical/operational entity in Clinical Assessments |
| 304 | `dbo.MNComprehensiveAssessmentTraumaHistory` | Clinical/operational entity in Clinical Assessments |
| 305 | `dbo.MNComprehensiveAssessmentVeteranStatus` | Clinical/operational entity in Clinical Assessments |
| 306 | `dbo.MNIndividualAbusePreventionPlan` | Clinical/operational entity in Clinical Assessments |
| 307 | `dbo.MNIntakeChecklist` | Clinical/operational entity in Clinical Assessments |
| 308 | `dbo.MOCommunityResourceAssessment` | Clinical/operational entity in Clinical Assessments |
| 309 | `dbo.MTQASPeriodicAssessment` | Clinical/operational entity in Clinical Assessments |
| 310 | `dbo.MasterFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 311 | `dbo.MasterMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 312 | `dbo.MedDeterminationDisorderDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 313 | `dbo.MedHistory` | Clinical/operational entity in Clinical Assessments |
| 314 | `dbo.MedicalScreening` | Clinical/operational entity in Clinical Assessments |
| 315 | `dbo.MedicationInductionAssessment` | Clinical/operational entity in Clinical Assessments |
| 316 | `dbo.MentalHealthInformedConsent` | Clinical/operational entity in Clinical Assessments |
| 317 | `dbo.MentalHealthProgressNoteDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 318 | `dbo.MentalHealthProgressNoteDiagnosisRevised` | Clinical/operational entity in Clinical Assessments |
| 319 | `dbo.MentalHealthProgressNoteRevised` | Clinical/operational entity in Clinical Assessments |
| 320 | `dbo.MentalHealthSymptomScreening` | Clinical/operational entity in Clinical Assessments |
| 321 | `dbo.MetalHealthHospitalizationDetails` | Clinical/operational entity in Clinical Assessments |
| 322 | `dbo.MoCommunityResourceAssessmentDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 323 | `dbo.MoCommunityResourceSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 324 | `dbo.MoCommunitySupportDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 325 | `dbo.NCPIEDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 326 | `dbo.NODSCLIP_GamblingAssessment` | Clinical/operational entity in Clinical Assessments |
| 327 | `dbo.NVAdmissionAssessmentAddendum` | Clinical/operational entity in Clinical Assessments |
| 328 | `dbo.NVAdmissionAssessmentAlcohol` | Clinical/operational entity in Clinical Assessments |
| 329 | `dbo.NVAdmissionAssessmentCannabis` | Clinical/operational entity in Clinical Assessments |
| 330 | `dbo.NVAdmissionAssessmentHallucinogens` | Clinical/operational entity in Clinical Assessments |
| 331 | `dbo.NVAdmissionAssessmentInhalants` | Clinical/operational entity in Clinical Assessments |
| 332 | `dbo.NVAdmissionAssessmentOpioids` | Clinical/operational entity in Clinical Assessments |
| 333 | `dbo.NVAdmissionAssessmentPhencyclidine` | Clinical/operational entity in Clinical Assessments |
| 334 | `dbo.NVAdmissionAssessmentSedative` | Clinical/operational entity in Clinical Assessments |
| 335 | `dbo.NVAdmissionAssessmentStimulants` | Clinical/operational entity in Clinical Assessments |
| 336 | `dbo.NVAdmissionAssessmentTobacco` | Clinical/operational entity in Clinical Assessments |
| 337 | `dbo.NVLOCUSAssessment` | Clinical/operational entity in Clinical Assessments |
| 338 | `dbo.NVMentalHealthAssessment` | Clinical/operational entity in Clinical Assessments |
| 339 | `dbo.NVPrenatalPregnancyHistory` | Clinical/operational entity in Clinical Assessments |
| 340 | `dbo.NewAdmissionAssessment` | Clinical/operational entity in Clinical Assessments |
| 341 | `dbo.NewAdmissionAssessmentASAMDimension1` | Clinical/operational entity in Clinical Assessments |
| 342 | `dbo.NewAdmissionAssessmentASAMDimension2` | Clinical/operational entity in Clinical Assessments |
| 343 | `dbo.NewAdmissionAssessmentASAMDimension3` | Clinical/operational entity in Clinical Assessments |
| 344 | `dbo.NewAdmissionAssessmentASAMDimension4` | Clinical/operational entity in Clinical Assessments |
| 345 | `dbo.NewAdmissionAssessmentASAMDimension5` | Clinical/operational entity in Clinical Assessments |
| 346 | `dbo.NewAdmissionAssessmentASAMDimension6` | Clinical/operational entity in Clinical Assessments |
| 347 | `dbo.NewAdmissionAssessmentAllergy` | Clinical/operational entity in Clinical Assessments |
| 348 | `dbo.NewAdmissionAssessmentFormReferral` | Clinical/operational entity in Clinical Assessments |
| 349 | `dbo.NewAdmissionAssessmentMHPractitionersGrid` | Clinical/operational entity in Clinical Assessments |
| 350 | `dbo.NewAdmissionAssessmentMedication` | Clinical/operational entity in Clinical Assessments |
| 351 | `dbo.NewAdmissionAssessmentMedicationGrid` | Clinical/operational entity in Clinical Assessments |
| 352 | `dbo.NewAdmissionAssessmentPractitionersGrid` | Clinical/operational entity in Clinical Assessments |
| 353 | `dbo.NewAdmissionAssessmentPregnancyGrid` | Clinical/operational entity in Clinical Assessments |
| 354 | `dbo.NewAdmissionAssessmentReferrals` | Clinical/operational entity in Clinical Assessments |
| 355 | `dbo.NewAdmissionAssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 356 | `dbo.NewAdmissionAssessmentTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 357 | `dbo.NewDTPFMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 358 | `dbo.NewDTPFPriorSubstanceUseTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 359 | `dbo.NewDTPFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 360 | `dbo.NewPeriodicReassessment` | Clinical/operational entity in Clinical Assessments |
| 361 | `dbo.NewPeriodicReassessmentCounselorReview` | Clinical/operational entity in Clinical Assessments |
| 362 | `dbo.NewPeriodicReassessmentD1` | Clinical/operational entity in Clinical Assessments |
| 363 | `dbo.NewPeriodicReassessmentD2` | Clinical/operational entity in Clinical Assessments |
| 364 | `dbo.NewPeriodicReassessmentD3` | Clinical/operational entity in Clinical Assessments |
| 365 | `dbo.NewPeriodicReassessmentD4` | Clinical/operational entity in Clinical Assessments |
| 366 | `dbo.NewPeriodicReassessmentD5` | Clinical/operational entity in Clinical Assessments |
| 367 | `dbo.NewPeriodicReassessmentD6` | Clinical/operational entity in Clinical Assessments |
| 368 | `dbo.NewPeriodicReassessmentPractitioners` | Clinical/operational entity in Clinical Assessments |
| 369 | `dbo.NewPeriodicReassessmentPregnancyGrid` | Clinical/operational entity in Clinical Assessments |
| 370 | `dbo.NewPeriodicReassessmentUDS` | Clinical/operational entity in Clinical Assessments |
| 371 | `dbo.NursingAssessment` | Clinical/operational entity in Clinical Assessments |
| 372 | `dbo.NursingAssessmentSubstanceHistory` | Clinical/operational entity in Clinical Assessments |
| 373 | `dbo.NursingEvaluationAllergy` | Clinical/operational entity in Clinical Assessments |
| 374 | `dbo.NursingEvaluationSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 375 | `dbo.OTPHealthHomeOptOut` | Clinical/operational entity in Clinical Assessments |
| 376 | `dbo.OTPRequestforCourtesyDosingDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 377 | `dbo.OverdoseAssessment` | Clinical/operational entity in Clinical Assessments |
| 378 | `dbo.PADimension1` | Clinical/operational entity in Clinical Assessments |
| 379 | `dbo.PADimension2` | Clinical/operational entity in Clinical Assessments |
| 380 | `dbo.PADimension3` | Clinical/operational entity in Clinical Assessments |
| 381 | `dbo.PADimension4` | Clinical/operational entity in Clinical Assessments |
| 382 | `dbo.PADimension5` | Clinical/operational entity in Clinical Assessments |
| 383 | `dbo.PADimension6` | Clinical/operational entity in Clinical Assessments |
| 384 | `dbo.PeriodicReassessment` | Clinical/operational entity in Clinical Assessments |
| 385 | `dbo.PeriodicReassessmentUDS` | Clinical/operational entity in Clinical Assessments |
| 386 | `dbo.PhysicalExams` | Clinical/operational entity in Clinical Assessments |
| 387 | `dbo.PlacerASAM` | Clinical/operational entity in Clinical Assessments |
| 388 | `dbo.PlacerCalOMSAdmissionQuestionnaire` | Clinical/operational entity in Clinical Assessments |
| 389 | `dbo.PlacerCoMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 390 | `dbo.PlacerCoMedicalHistoryCurrentMedication` | Clinical/operational entity in Clinical Assessments |
| 391 | `dbo.PlacerCoMedicalHistoryPastMedication` | Clinical/operational entity in Clinical Assessments |
| 392 | `dbo.PreAdmissionFormReferral` | Clinical/operational entity in Clinical Assessments |
| 393 | `dbo.PreAdmissionMedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 394 | `dbo.PreAdmissionMedication` | Clinical/operational entity in Clinical Assessments |
| 395 | `dbo.PreAdmissionOTCMedication` | Clinical/operational entity in Clinical Assessments |
| 396 | `dbo.PreAdmissionPractitioners` | Clinical/operational entity in Clinical Assessments |
| 397 | `dbo.PreAdmissionPregnancy` | Clinical/operational entity in Clinical Assessments |
| 398 | `dbo.PreAdmissionSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 399 | `dbo.PreAdmissionTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 400 | `dbo.PriorMentalHealthTreatment` | Clinical/operational entity in Clinical Assessments |
| 401 | `dbo.PriorSubstanceAbuse` | Clinical/operational entity in Clinical Assessments |
| 402 | `dbo.PriorSubstanceUseTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 403 | `dbo.ProgressAssessmentWorksheet` | Clinical/operational entity in Clinical Assessments |
| 404 | `dbo.ProgressNoteDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 405 | `dbo.PsychEvalFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 406 | `dbo.PsychEvalFormSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 407 | `dbo.RIHealthHomeCareReview` | Clinical/operational entity in Clinical Assessments |
| 408 | `dbo.RIHealthHomeConsentToReceive` | Clinical/operational entity in Clinical Assessments |
| 409 | `dbo.RIHealthHomeEligibilityFollUpChecklist` | Clinical/operational entity in Clinical Assessments |
| 410 | `dbo.RIHealthHomeHistory` | Clinical/operational entity in Clinical Assessments |
| 411 | `dbo.RIHealthHomeHistoryAllergy` | Clinical/operational entity in Clinical Assessments |
| 412 | `dbo.RIHealthHomeHistoryCurrentMedication` | Clinical/operational entity in Clinical Assessments |
| 413 | `dbo.RIHealthHomeNote` | Clinical/operational entity in Clinical Assessments |
| 414 | `dbo.RIHealthHomeTriageAssessment` | Clinical/operational entity in Clinical Assessments |
| 415 | `dbo.RNP_AdmissionHistoryList` | Clinical/operational entity in Clinical Assessments |
| 416 | `dbo.RNP_AdmissionPhysicalHistory` | Clinical/operational entity in Clinical Assessments |
| 417 | `dbo.RNP_Assessment` | Clinical/operational entity in Clinical Assessments |
| 418 | `dbo.RNP_AssessmentDetails` | Clinical/operational entity in Clinical Assessments |
| 419 | `dbo.RNP_Assessment_51` | Clinical/operational entity in Clinical Assessments |
| 420 | `dbo.RNP_Diagnosis` | Clinical/operational entity in Clinical Assessments |
| 421 | `dbo.RNP_IntakeHistory` | Clinical/operational entity in Clinical Assessments |
| 422 | `dbo.RNP_IntakeHistoryDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 423 | `dbo.RNP_IntakeHistoryPrescription` | Clinical/operational entity in Clinical Assessments |
| 424 | `dbo.RNP_PeriodicAssessment` | Clinical/operational entity in Clinical Assessments |
| 425 | `dbo.RNP_PriorSubstanceAbuseMentalHealthTreatments` | Clinical/operational entity in Clinical Assessments |
| 426 | `dbo.RNP_ShortFormDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 427 | `dbo.RNP_SubstanceHistory` | Clinical/operational entity in Clinical Assessments |
| 428 | `dbo.RNP_SubstanceHistory_IntakeHistory` | Clinical/operational entity in Clinical Assessments |
| 429 | `dbo.RNP_SubstanceHistory_PeriodicAssessment` | Clinical/operational entity in Clinical Assessments |
| 430 | `dbo.RNP_SubstanceHistory_PsychiatricEvaluation` | Clinical/operational entity in Clinical Assessments |
| 431 | `dbo.RNP_SubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 432 | `dbo.ReAssessment` | Clinical/operational entity in Clinical Assessments |
| 433 | `dbo.ReAssessmentFamily` | Clinical/operational entity in Clinical Assessments |
| 434 | `dbo.ReAssessmentLegal` | Clinical/operational entity in Clinical Assessments |
| 435 | `dbo.ReAssessmentMentalHealth` | Clinical/operational entity in Clinical Assessments |
| 436 | `dbo.ReAssessmentOccupational` | Clinical/operational entity in Clinical Assessments |
| 437 | `dbo.ReAssessmentPhysicalHealth` | Clinical/operational entity in Clinical Assessments |
| 438 | `dbo.ReAssessmentPractitioner` | Clinical/operational entity in Clinical Assessments |
| 439 | `dbo.ReAssessmentSocial` | Clinical/operational entity in Clinical Assessments |
| 440 | `dbo.ReAssessmentStrength` | Clinical/operational entity in Clinical Assessments |
| 441 | `dbo.ReAssessmentSubstanceUse` | Clinical/operational entity in Clinical Assessments |
| 442 | `dbo.ReAssessmentSummary` | Clinical/operational entity in Clinical Assessments |
| 443 | `dbo.ReAssessmentTreatment` | Clinical/operational entity in Clinical Assessments |
| 444 | `dbo.ReAssessmentUAResult` | Clinical/operational entity in Clinical Assessments |
| 445 | `dbo.ReclassifySignedServicesHistory` | Clinical/operational entity in Clinical Assessments |
| 446 | `dbo.RelapsePriorMentalHealthTreatment` | Clinical/operational entity in Clinical Assessments |
| 447 | `dbo.RiskAssessment` | Clinical/operational entity in Clinical Assessments |
| 448 | `dbo.SF_AdultNutritionalScreening` | Clinical/operational entity in Clinical Assessments |
| 449 | `dbo.SF_BehavioralScreen` | Clinical/operational entity in Clinical Assessments |
| 450 | `dbo.SF_BehavioralScreenScoring` | Clinical/operational entity in Clinical Assessments |
| 451 | `dbo.SF_ConsentToHealthDepartment` | Clinical/operational entity in Clinical Assessments |
| 452 | `dbo.SF_Cows` | Clinical/operational entity in Clinical Assessments |
| 453 | `dbo.SF_FamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 454 | `dbo.SF_GeneralHealthInformation` | Clinical/operational entity in Clinical Assessments |
| 455 | `dbo.SF_IllnessHistory` | Clinical/operational entity in Clinical Assessments |
| 456 | `dbo.SF_InfectiousDiseaseNBehavioralScreen` | Clinical/operational entity in Clinical Assessments |
| 457 | `dbo.SF_MedicalHistory` | Clinical/operational entity in Clinical Assessments |
| 458 | `dbo.SF_PastHistory` | Clinical/operational entity in Clinical Assessments |
| 459 | `dbo.SF_PhysicalExam` | Clinical/operational entity in Clinical Assessments |
| 460 | `dbo.SF_PhysiologicalAddictionSummary` | Clinical/operational entity in Clinical Assessments |
| 461 | `dbo.SF_PreAdmissionPrescription` | Clinical/operational entity in Clinical Assessments |
| 462 | `dbo.SF_ScreeningIntakeNotes` | Clinical/operational entity in Clinical Assessments |
| 463 | `dbo.SF_SuicideRisk` | Clinical/operational entity in Clinical Assessments |
| 464 | `dbo.SF_SuicideRiskStandAlone` | Clinical/operational entity in Clinical Assessments |
| 465 | `dbo.SignsOfWithdrawals` | Clinical/operational entity in Clinical Assessments |
| 466 | `dbo.SlidingScaleApp` | Clinical/operational entity in Clinical Assessments |
| 467 | `dbo.SlidingScaleFeeGuidelines` | Clinical/operational entity in Clinical Assessments |
| 468 | `dbo.SmartcareRelease` | Clinical/operational entity in Clinical Assessments |
| 469 | `dbo.SpecificASAMDimensions` | Clinical/operational entity in Clinical Assessments |
| 470 | `dbo.SubstanceAbuseHistory` | Clinical/operational entity in Clinical Assessments |
| 471 | `dbo.SubstanceHistoryCriteriaGrid` | Clinical/operational entity in Clinical Assessments |
| 472 | `dbo.SubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 473 | `dbo.SuicideSeverityRatingScale` | Clinical/operational entity in Clinical Assessments |
| 474 | `dbo.SupplementalAssessment` | Clinical/operational entity in Clinical Assessments |
| 475 | `dbo.SystemAssessment` | Clinical/operational entity in Clinical Assessments |
| 476 | `dbo.TBScreening` | Clinical/operational entity in Clinical Assessments |
| 477 | `dbo.TCMITPDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 478 | `dbo.TCMNeedsAssessment` | Clinical/operational entity in Clinical Assessments |
| 479 | `dbo.TCUDrugScreen` | Clinical/operational entity in Clinical Assessments |
| 480 | `dbo.TakeHomeRiskAssessment` | Clinical/operational entity in Clinical Assessments |
| 481 | `dbo.TransitionandDischargePlanDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 482 | `dbo.TuberCulosisScreening` | Clinical/operational entity in Clinical Assessments |
| 483 | `dbo.TuberculosisRiskScreeningQuestionnaire` | Clinical/operational entity in Clinical Assessments |
| 484 | `dbo.UrineDrugScreenResult` | Clinical/operational entity in Clinical Assessments |
| 485 | `dbo.UrineDrugScreenResultsForOBOT` | Clinical/operational entity in Clinical Assessments |
| 486 | `dbo.UrineDrugScreenResultsForOTPProvider` | Clinical/operational entity in Clinical Assessments |
| 487 | `dbo.VAComprehensiveAssessment` | Clinical/operational entity in Clinical Assessments |
| 488 | `dbo.VAComprehensiveAssessmentAllergy` | Clinical/operational entity in Clinical Assessments |
| 489 | `dbo.VAComprehensiveAssessmentDimensionFiveMentalStatusExam` | Clinical/operational entity in Clinical Assessments |
| 490 | `dbo.VAComprehensiveAssessmentDimensionFiveSubstanceUse` | Clinical/operational entity in Clinical Assessments |
| 491 | `dbo.VAComprehensiveAssessmentDimensionOneDetail` | Clinical/operational entity in Clinical Assessments |
| 492 | `dbo.VAComprehensiveAssessmentDimensionOneDisorder` | Clinical/operational entity in Clinical Assessments |
| 493 | `dbo.VAComprehensiveAssessmentDimensionOneSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 494 | `dbo.VAComprehensiveAssessmentDimentionFour` | Clinical/operational entity in Clinical Assessments |
| 495 | `dbo.VAComprehensiveAssessmentDimentionSix` | Clinical/operational entity in Clinical Assessments |
| 496 | `dbo.VAComprehensiveAssessmentDimentionThree` | Clinical/operational entity in Clinical Assessments |
| 497 | `dbo.VAComprehensiveAssessmentDimentionTwo` | Clinical/operational entity in Clinical Assessments |
| 498 | `dbo.VAComprehensiveAssessmentEducationalHistory` | Clinical/operational entity in Clinical Assessments |
| 499 | `dbo.VAComprehensiveAssessmentFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 500 | `dbo.VAComprehensiveAssessmentLastSummary` | Clinical/operational entity in Clinical Assessments |
| 501 | `dbo.VAComprehensiveAssessmentLegalHistory` | Clinical/operational entity in Clinical Assessments |
| 502 | `dbo.VAComprehensiveAssessmentMedication` | Clinical/operational entity in Clinical Assessments |
| 503 | `dbo.VAComprehensiveAssessmentModifiedMINIScreen` | Clinical/operational entity in Clinical Assessments |
| 504 | `dbo.VAComprehensiveAssessmentOccupationalHistory` | Clinical/operational entity in Clinical Assessments |
| 505 | `dbo.VAComprehensiveAssessmentPersonalHistory` | Clinical/operational entity in Clinical Assessments |
| 506 | `dbo.VAComprehensiveAssessmentPractitioners` | Clinical/operational entity in Clinical Assessments |
| 507 | `dbo.VAComprehensiveAssessmentSexualHistory` | Clinical/operational entity in Clinical Assessments |
| 508 | `dbo.VAComprehensiveAssessmentSocialHistory` | Clinical/operational entity in Clinical Assessments |
| 509 | `dbo.VAComprehensiveAssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 510 | `dbo.VAComprehensiveAssessmentSummary` | Clinical/operational entity in Clinical Assessments |
| 511 | `dbo.VAComprehensiveAssessmentTraumaHistory` | Clinical/operational entity in Clinical Assessments |
| 512 | `dbo.VAComprehensiveAssessmentTreatmentHistory` | Clinical/operational entity in Clinical Assessments |
| 513 | `dbo.VAComprehensiveAssessmentVeteranStatus` | Clinical/operational entity in Clinical Assessments |
| 514 | `dbo.WeCare_PriorMentalHealthTreatment` | Clinical/operational entity in Clinical Assessments |
| 515 | `dbo.WeCare_PriorSubstanceAbuse` | Clinical/operational entity in Clinical Assessments |
| 516 | `dbo.WeCare_RelapsePriorMentalHealthTreatment` | Clinical/operational entity in Clinical Assessments |
| 517 | `dbo.YoloCountyIntake` | Clinical/operational entity in Clinical Assessments |
| 518 | `dbo.eanDMCPTcode_bak_10252024` | Clinical/operational entity in Clinical Assessments |
| 519 | `dbo.eanDMcoderule_bak_10252024` | Clinical/operational entity in Clinical Assessments |
| 520 | `dbo.eandMCPTCode_bak_10032024` | Clinical/operational entity in Clinical Assessments |
| 521 | `dbo.eandMcPtcode_bak_03172025` | Clinical/operational entity in Clinical Assessments |
| 522 | `dbo.eandMcodelist_bak_03172025` | Clinical/operational entity in Clinical Assessments |
| 523 | `dbo.eandMcodelist_bak_10032024` | Clinical/operational entity in Clinical Assessments |
| 524 | `dbo.eandMcoderule_bak_03172025` | Clinical/operational entity in Clinical Assessments |
| 525 | `dbo.eandMcoderule_bak_10032024` | Clinical/operational entity in Clinical Assessments |
| 526 | `dbo.eandMformConfiguration_bak_10032024` | Clinical/operational entity in Clinical Assessments |
| 527 | `dbo.eandMformconfiguration_bak_03172025` | Clinical/operational entity in Clinical Assessments |
| 528 | `dbo.eandMformconfiguration_bak_10252024` | Clinical/operational entity in Clinical Assessments |
| 529 | `dbo.firstassessments` | Clinical/operational entity in Clinical Assessments |
| 530 | `dbo.intakeformsmenu_01162026` | Clinical/operational entity in Clinical Assessments |
| 531 | `dbo.intakeformsmenu_12152025` | Clinical/operational entity in Clinical Assessments |
| 532 | `dbo.intakeformsmenu_bak_01142026` | Clinical/operational entity in Clinical Assessments |
| 533 | `dbo.intakeformsmenu_bak_03172025` | Clinical/operational entity in Clinical Assessments |
| 534 | `dbo.intakeformsmenu_bak_09022026` | Clinical/operational entity in Clinical Assessments |
| 535 | `dbo.intakeformsmenu_bak_10252024` | Clinical/operational entity in Clinical Assessments |
| 536 | `dbo.intakepackettypes_bak_10252024` | Clinical/operational entity in Clinical Assessments |
| 537 | `dbo.tbl3PBILLHISTORY` | Clinical/operational entity in Clinical Assessments |
| 538 | `dbo.tbl3PSETUPLOGHISTORY` | Clinical/operational entity in Clinical Assessments |
| 539 | `dbo.tbl3psetupAttPhysHistory` | Clinical/operational entity in Clinical Assessments |
| 540 | `dbo.tblAssessmentRemoval` | Clinical/operational entity in Clinical Assessments |
| 541 | `dbo.tblCalomsInformation` | Clinical/operational entity in Clinical Assessments |
| 542 | `dbo.tblDUIINTAKE` | Clinical/operational entity in Clinical Assessments |
| 543 | `dbo.tblDiagnosticAssessment` | Clinical/operational entity in Clinical Assessments |
| 544 | `dbo.tblDiagnosticAssessmentDiagnosis` | Clinical/operational entity in Clinical Assessments |
| 545 | `dbo.tblHistory` | Clinical/operational entity in Clinical Assessments |
| 546 | `dbo.tblINTAKEFORMS` | Clinical/operational entity in Clinical Assessments |
| 547 | `dbo.tblLPHADiagnosticSummaryDetermination` | Clinical/operational entity in Clinical Assessments |
| 548 | `dbo.tblMentalHealthProgressNote` | Clinical/operational entity in Clinical Assessments |
| 549 | `dbo.tblMentalHealthProgressNote_bak20241119` | Clinical/operational entity in Clinical Assessments |
| 550 | `dbo.tblNursingAssessmentAllergy` | Clinical/operational entity in Clinical Assessments |
| 551 | `dbo.tblNursingAssessmentCurrentMedication` | Clinical/operational entity in Clinical Assessments |
| 552 | `dbo.tblNursingAssessmentSubstanceUseHistory` | Clinical/operational entity in Clinical Assessments |
| 553 | `dbo.tblNursingAssessmentVitals` | Clinical/operational entity in Clinical Assessments |
| 554 | `dbo.tblPayerCltHistory` | Clinical/operational entity in Clinical Assessments |
| 555 | `dbo.tblPsychiastristEvalAllergy` | Clinical/operational entity in Clinical Assessments |
| 556 | `dbo.tblPsychiastristEvalFamilyHistory` | Clinical/operational entity in Clinical Assessments |
| 557 | `dbo.tblREQUIREDINTAKEFIELDS` | Clinical/operational entity in Clinical Assessments |
| 558 | `dbo.tblSCALE` | Clinical/operational entity in Clinical Assessments |
| 559 | `dbo.tblWTCIntake` | Clinical/operational entity in Clinical Assessments |
| 560 | `dbo.tblbotrecept_History` | Clinical/operational entity in Clinical Assessments |
| 561 | `dbo.tblduiMentalHealth` | Clinical/operational entity in Clinical Assessments |
| 562 | `dbo.tblduiSubsAbuse` | Clinical/operational entity in Clinical Assessments |

### 1.3 Treatment Plans, Treatment Levels & Progress Notes (61 tables)
*Individual Treatment Plans (ITP), periodic reassessments, treatment level advancement (Phase 1-4), counselor reviews, DAP/SOAP session progress notes, and relapse prevention plans.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.BenzodiazepineActionPlan` | Clinical/operational entity in Treatment Plans |
| 2 | `dbo.BenzodiazepineActionPlanRevised` | Clinical/operational entity in Treatment Plans |
| 3 | `dbo.CLINIC59_COUNSNOTES` | Clinical/operational entity in Treatment Plans |
| 4 | `dbo.CLINIC59_NOTES` | Clinical/operational entity in Treatment Plans |
| 5 | `dbo.CaseIntervention` | Clinical/operational entity in Treatment Plans |
| 6 | `dbo.CaseProgress` | Clinical/operational entity in Treatment Plans |
| 7 | `dbo.CaseVisitNote` | Clinical/operational entity in Treatment Plans |
| 8 | `dbo.DAPIntervention` | Clinical/operational entity in Treatment Plans |
| 9 | `dbo.DAPPlan` | Clinical/operational entity in Treatment Plans |
| 10 | `dbo.DischargeTransferPlanForm` | Clinical/operational entity in Treatment Plans |
| 11 | `dbo.DraftDAPNote` | Clinical/operational entity in Treatment Plans |
| 12 | `dbo.DropDownListFamilySupportPlan` | Clinical/operational entity in Treatment Plans |
| 13 | `dbo.FamilySupportPlan` | Clinical/operational entity in Treatment Plans |
| 14 | `dbo.FamilySupportPlanProviders` | Clinical/operational entity in Treatment Plans |
| 15 | `dbo.GroupNoteSession` | Clinical/operational entity in Treatment Plans |
| 16 | `dbo.Groupnote` | Clinical/operational entity in Treatment Plans |
| 17 | `dbo.InitialServicesPlanandVAD` | Clinical/operational entity in Treatment Plans |
| 18 | `dbo.InitialTreatmentPlan` | Clinical/operational entity in Treatment Plans |
| 19 | `dbo.InitialTreatmentPlanSNAP` | Clinical/operational entity in Treatment Plans |
| 20 | `dbo.KYAftercarePlan` | Clinical/operational entity in Treatment Plans |
| 21 | `dbo.KYCaseManageProgressNote` | Clinical/operational entity in Treatment Plans |
| 22 | `dbo.KYTCMITPCurrentRxOrders` | Clinical/operational entity in Treatment Plans |
| 23 | `dbo.KYTCMTreatmentPlanReview` | Clinical/operational entity in Treatment Plans |
| 24 | `dbo.MITreatmentPlanReview` | Clinical/operational entity in Treatment Plans |
| 25 | `dbo.MOCommunitySupportProgressNote` | Clinical/operational entity in Treatment Plans |
| 26 | `dbo.MedicaidTreatmentPlanReview` | Clinical/operational entity in Treatment Plans |
| 27 | `dbo.NCInitialTransitionDischargePlan` | Clinical/operational entity in Treatment Plans |
| 28 | `dbo.NewDischargeTransferPlanForm` | Clinical/operational entity in Treatment Plans |
| 29 | `dbo.NewDischargeTransferPlanForm_03192025` | Clinical/operational entity in Treatment Plans |
| 30 | `dbo.NewDischargeTransferPlanUDS` | Clinical/operational entity in Treatment Plans |
| 31 | `dbo.NorthCarolinaCrisisPlan` | Clinical/operational entity in Treatment Plans |
| 32 | `dbo.Notes` | Clinical/operational entity in Treatment Plans |
| 33 | `dbo.OBOTProviderProgressNoteObjective` | Clinical/operational entity in Treatment Plans |
| 34 | `dbo.OBOTProviderProgressNoteSubjective` | Clinical/operational entity in Treatment Plans |
| 35 | `dbo.OTPProviderProgressFollowUpNoteObjective` | Clinical/operational entity in Treatment Plans |
| 36 | `dbo.OTPProviderProgressFollowUpNoteSubjective` | Clinical/operational entity in Treatment Plans |
| 37 | `dbo.PACounselorReview` | Clinical/operational entity in Treatment Plans |
| 38 | `dbo.PersonalSafetyPlan` | Clinical/operational entity in Treatment Plans |
| 39 | `dbo.ProgressNote` | Clinical/operational entity in Treatment Plans |
| 40 | `dbo.ProgressNoteUDS` | Clinical/operational entity in Treatment Plans |
| 41 | `dbo.Soapnote` | Clinical/operational entity in Treatment Plans |
| 42 | `dbo.TCMITPForm` | Clinical/operational entity in Treatment Plans |
| 43 | `dbo.TransitionandDischargePlan` | Clinical/operational entity in Treatment Plans |
| 44 | `dbo.TransitionandDischargePlanSNAP` | Clinical/operational entity in Treatment Plans |
| 45 | `dbo.TreatmentPlanSNAP` | Clinical/operational entity in Treatment Plans |
| 46 | `dbo.VAPeerRecoveryWellnessPlan` | Clinical/operational entity in Treatment Plans |
| 47 | `dbo.tbl3pARNOTE` | Clinical/operational entity in Treatment Plans |
| 48 | `dbo.tbl3pClaimNote` | Clinical/operational entity in Treatment Plans |
| 49 | `dbo.tblADSCaseAssigmentOrTermination` | Clinical/operational entity in Treatment Plans |
| 50 | `dbo.tblDRnote` | Clinical/operational entity in Treatment Plans |
| 51 | `dbo.tblDefaultNotes` | Clinical/operational entity in Treatment Plans |
| 52 | `dbo.tblNOTE` | Clinical/operational entity in Treatment Plans |
| 53 | `dbo.tblSNAPNotes` | Clinical/operational entity in Treatment Plans |
| 54 | `dbo.tblTransitionPlan` | Clinical/operational entity in Treatment Plans |
| 55 | `dbo.tblTreatmentLevel` | Clinical/operational entity in Treatment Plans |
| 56 | `dbo.tblTreatmentPlanLog` | Clinical/operational entity in Treatment Plans |
| 57 | `dbo.tblTrtPlan` | Clinical/operational entity in Treatment Plans |
| 58 | `dbo.tblTrtPlanCodes` | Clinical/operational entity in Treatment Plans |
| 59 | `dbo.tblTrtPlanCodesGroups` | Clinical/operational entity in Treatment Plans |
| 60 | `dbo.tblTrtPlanDim` | Clinical/operational entity in Treatment Plans |
| 61 | `dbo.tblTrtPlanRev` | Clinical/operational entity in Treatment Plans |

### 1.4 Medication Dosing, Dispensing Windows & Liquid Logs (53 tables)
*Observed dosing administration, methadone/buprenorphine liquid logs, daily dosage changes, missed dose alerts, ePrescribing (eRx), and pharmacy integrations.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.BenzodiazepinesUseAgreement` | Clinical/operational entity in Medication Dosing |
| 2 | `dbo.COCMedicationDetail` | Clinical/operational entity in Medication Dosing |
| 3 | `dbo.DTPFormCurrentPrescribedMedication` | Clinical/operational entity in Medication Dosing |
| 4 | `dbo.DoseReviewForm` | Clinical/operational entity in Medication Dosing |
| 5 | `dbo.EducationPrescribedMedication` | Clinical/operational entity in Medication Dosing |
| 6 | `dbo.EducationPrescribedMedicationStandAlone` | Clinical/operational entity in Medication Dosing |
| 7 | `dbo.EvaluationAndManagement_PastMedication` | Clinical/operational entity in Medication Dosing |
| 8 | `dbo.GetAllClinicNamesForBenzodiazepineUseForm` | Clinical/operational entity in Medication Dosing |
| 9 | `dbo.HnP_TBMedications` | Clinical/operational entity in Medication Dosing |
| 10 | `dbo.MedicationRecord` | Clinical/operational entity in Medication Dosing |
| 11 | `dbo.Medications` | Clinical/operational entity in Medication Dosing |
| 12 | `dbo.MethadoneAssistedReport` | Clinical/operational entity in Medication Dosing |
| 13 | `dbo.MethadoneChainofCustodyRecord` | Clinical/operational entity in Medication Dosing |
| 14 | `dbo.MethadoneMaintenaceLevel_1_3` | Clinical/operational entity in Medication Dosing |
| 15 | `dbo.NewDTPFormCurrentPrescribedMedication` | Clinical/operational entity in Medication Dosing |
| 16 | `dbo.NursingEvaluationCurrentMedication` | Clinical/operational entity in Medication Dosing |
| 17 | `dbo.OMRBenzodiazepinePolicyException` | Clinical/operational entity in Medication Dosing |
| 18 | `dbo.OpioDoseStatus` | Clinical/operational entity in Medication Dosing |
| 19 | `dbo.OpioidOverdoseRisks` | Clinical/operational entity in Medication Dosing |
| 20 | `dbo.PastMedications` | Clinical/operational entity in Medication Dosing |
| 21 | `dbo.PhysicianJustificationUseBenzodiazepine` | Clinical/operational entity in Medication Dosing |
| 22 | `dbo.PreAdmisionPrescriptionMedications` | Clinical/operational entity in Medication Dosing |
| 23 | `dbo.PreferredPharmacy` | Clinical/operational entity in Medication Dosing |
| 24 | `dbo.PregnancyandMethadoneAgreement` | Clinical/operational entity in Medication Dosing |
| 25 | `dbo.PrescriptionMedicationCriteriaGrid` | Clinical/operational entity in Medication Dosing |
| 26 | `dbo.RIOverdosePreventionEducation` | Clinical/operational entity in Medication Dosing |
| 27 | `dbo.RNP_Medications` | Clinical/operational entity in Medication Dosing |
| 28 | `dbo.RNP_PrescriptionMedication` | Clinical/operational entity in Medication Dosing |
| 29 | `dbo.RNP_PsychiatricEvaluation_CurrentMedications` | Clinical/operational entity in Medication Dosing |
| 30 | `dbo.RegularMedication` | Clinical/operational entity in Medication Dosing |
| 31 | `dbo.SF_BenzodiazepineEducation` | Clinical/operational entity in Medication Dosing |
| 32 | `dbo.SF_TreatmentProgramMedication` | Clinical/operational entity in Medication Dosing |
| 33 | `dbo.TNOBOTHighDose` | Clinical/operational entity in Medication Dosing |
| 34 | `dbo.TreatmentServicesReviewCurrentMedication` | Clinical/operational entity in Medication Dosing |
| 35 | `dbo.ZingDoseQueue` | Clinical/operational entity in Medication Dosing |
| 36 | `dbo.ZingDoseQueueDetail` | Clinical/operational entity in Medication Dosing |
| 37 | `dbo.eRx_Prescriber_PlaceOfService` | Clinical/operational entity in Medication Dosing |
| 38 | `dbo.eRx_Prescription` | Clinical/operational entity in Medication Dosing |
| 39 | `dbo.eRx_PrescriptionMedication` | Clinical/operational entity in Medication Dosing |
| 40 | `dbo.eRx_Weno_PrescriptionMessage` | Clinical/operational entity in Medication Dosing |
| 41 | `dbo.tblCurrentMedicationMAR` | Clinical/operational entity in Medication Dosing |
| 42 | `dbo.tblDOSE` | Clinical/operational entity in Medication Dosing |
| 43 | `dbo.tblDOSECHARGE` | Clinical/operational entity in Medication Dosing |
| 44 | `dbo.tblDOSE_DATE_CHANGE` | Clinical/operational entity in Medication Dosing |
| 45 | `dbo.tblDOSE_Excuse` | Clinical/operational entity in Medication Dosing |
| 46 | `dbo.tblDosePre` | Clinical/operational entity in Medication Dosing |
| 47 | `dbo.tblLiquidLog` | Clinical/operational entity in Medication Dosing |
| 48 | `dbo.tblPAYDOSE` | Clinical/operational entity in Medication Dosing |
| 49 | `dbo.tblPAYPERDOSE` | Clinical/operational entity in Medication Dosing |
| 50 | `dbo.tblPPMDOSE` | Clinical/operational entity in Medication Dosing |
| 51 | `dbo.tblPsychiastristEvalCurrentMedication` | Clinical/operational entity in Medication Dosing |
| 52 | `dbo.tblPsychiastristEvalPastMedication` | Clinical/operational entity in Medication Dosing |
| 53 | `dbo.tblduiMedication` | Clinical/operational entity in Medication Dosing |

### 1.5 Take-Home Bottles, Diversion Control & Safety Compliance (13 tables)
*Take-home bottle tracking, Step 1-6 allowances, bottle lot verification, diversion compliance, and bottle recall SMS notifications.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.AntidiversionAgreement` | Clinical/operational entity in Take-Home Bottles |
| 2 | `dbo.DiversionControlNotificationofChange` | Clinical/operational entity in Take-Home Bottles |
| 3 | `dbo.RevisedTakeHomeJustification` | Clinical/operational entity in Take-Home Bottles |
| 4 | `dbo.TakeHomeAgreement` | Clinical/operational entity in Take-Home Bottles |
| 5 | `dbo.TakeHomeAgreementandDiversionControl` | Clinical/operational entity in Take-Home Bottles |
| 6 | `dbo.TakeHomeAgreementandDiversionControl_06182026` | Clinical/operational entity in Take-Home Bottles |
| 7 | `dbo.TakeHomeGuidelinesForm` | Clinical/operational entity in Take-Home Bottles |
| 8 | `dbo.TakeHomeJustificationV2` | Clinical/operational entity in Take-Home Bottles |
| 9 | `dbo.TakeHomeViewModel` | Clinical/operational entity in Take-Home Bottles |
| 10 | `dbo.tblBOTTLEPOWDERDETAIL` | Clinical/operational entity in Take-Home Bottles |
| 11 | `dbo.tblBottle` | Clinical/operational entity in Take-Home Bottles |
| 12 | `dbo.tblBottlePowder` | Clinical/operational entity in Take-Home Bottles |
| 13 | `dbo.tblDiversionConsentLog` | Clinical/operational entity in Take-Home Bottles |

### 1.6 Urine Drug Screens (UDS), Toxicology & Reference Lab Feeds (63 tables)
*Random urine drug screens, point-of-care rapid cup results, Cordant & reference lab interfaces, collection schedules, and confirmatory toxicology panels.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.AnnualJustification` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 2 | `dbo.AnnualJustificationRevised` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 3 | `dbo.AnnualPhysicalWaiver` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 4 | `dbo.AppointmentQualifierMapping` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 5 | `dbo.BHSCareQualityOptOut` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 6 | `dbo.DAPUAResult` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 7 | `dbo.EvaluationAndManagement` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 8 | `dbo.EvaluationAndManagement_ReceivingMedicalCare` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 9 | `dbo.HL7Lab Information` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 10 | `dbo.HL7LabAcctNoPerSite` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 11 | `dbo.HL7LabInsuranceMap` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 12 | `dbo.HL7LabTestTypes` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 13 | `dbo.HL7TestTypesPerSiteLab` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 14 | `dbo.HaywardCRIforDualEnrlCheckAddress` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 15 | `dbo.IndividualGroup` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 16 | `dbo.InitialCompAssesCurrentLivingSituation` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 17 | `dbo.InitialCompAssesSexuality` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 18 | `dbo.InitialCompAssesSpiritually` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 19 | `dbo.LabReleaseConsentVT` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 20 | `dbo.LabReleaseConsentVermont` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 21 | `dbo.Laboratories` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 22 | `dbo.LaboratoryTestingWaiver` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 23 | `dbo.LivingSituation` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 24 | `dbo.NinetyDayReviewUAResult` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 25 | `dbo.NursingEvaluation` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 26 | `dbo.NursingEvaluationVitals` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 27 | `dbo.RNP_PsychiatricEvaluation` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 28 | `dbo.SFTPLabDetail` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 29 | `dbo.Spirituality` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 30 | `dbo.StocktonCRIforDualEnrlCheckAddress` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 31 | `dbo.TblUAResult_export` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 32 | `dbo.labsmay` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 33 | `dbo.tblABHSReasondropdown` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 34 | `dbo.tblIndividualForms` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 35 | `dbo.tblLABELv5` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 36 | `dbo.tblLABRESULT` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 37 | `dbo.tblLABRESULTDETAIL` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 38 | `dbo.tblLabel` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 39 | `dbo.tblQualityAssuranceDetails` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 40 | `dbo.tblQualityAssuranceSet` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 41 | `dbo.tblSplitNameForUnmappedTblUAResult` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 42 | `dbo.tblUAResult` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 43 | `dbo.tblUAResultDetail` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 44 | `dbo.tblUAResultDetail_16thJan2024` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 45 | `dbo.tblUAResultDetail_Conversion` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 46 | `dbo.tblUASched` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 47 | `dbo.tblUASched-org-5thFeb2024B` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 48 | `dbo.tblUASchedTests` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 49 | `dbo.tblUASchedTests_HL7` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 50 | `dbo.tblUASched_HL7` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 51 | `dbo.tblUASched_export` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 52 | `dbo.tblUASched_org` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 53 | `dbo.tblUATemp` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 54 | `dbo.tblUAToxResultNotification` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 55 | `dbo.tblUAToxResultNotificationDetail` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 56 | `dbo.tblUAmanifest` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 57 | `dbo.tblUAprogvars` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 58 | `dbo.tblUAschedPanel` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 59 | `dbo.tblUAtests` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 60 | `dbo.tblUAtestsPanels` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 61 | `dbo.tblUAtestsSetup` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 62 | `dbo.tblUAtype` | Clinical/operational entity in Urine Drug Screens (UDS) |
| 63 | `dbo.tbluaprogvars_bak10252024` | Clinical/operational entity in Urine Drug Screens (UDS) |

### 1.7 Appointments, Calendars & Dosing Window Check-In (12 tables)
*Medical & counseling appointment schedules, daily calendar mapping, visit check-in arrival queues, and lobby wait-time tracking.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.AppointmentAttend` | Clinical/operational entity in Appointments |
| 2 | `dbo.AppointmentNotificationStatus` | Clinical/operational entity in Appointments |
| 3 | `dbo.AppointmentQueueConfiguration` | Clinical/operational entity in Appointments |
| 4 | `dbo.Appointments` | Clinical/operational entity in Appointments |
| 5 | `dbo.Appointments_bak20260618122228` | Clinical/operational entity in Appointments |
| 6 | `dbo.Appointments_bak20260715220201` | Clinical/operational entity in Appointments |
| 7 | `dbo.Appointments_bak20260815220200` | Clinical/operational entity in Appointments |
| 8 | `dbo.Appointments_bak20260901200000` | Clinical/operational entity in Appointments |
| 9 | `dbo.Appointments_bak20260915220200` | Clinical/operational entity in Appointments |
| 10 | `dbo.CheckInMessageConfig` | Clinical/operational entity in Appointments |
| 11 | `dbo.appointmentexcuse` | Clinical/operational entity in Appointments |
| 12 | `dbo.tblCHECKIN` | Clinical/operational entity in Appointments |

### 1.8 Patient Communications, SMS (8x8) & Mobile Notifications (10 tables)
*Automated appointment reminders, 8x8 SMS gateway logs, notification templates, and mobile banner configurations.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ConditionalLicenseNotificationCurrent` | Clinical/operational entity in Patient Communications |
| 2 | `dbo.ConditionalLicenseNotificationProspective` | Clinical/operational entity in Patient Communications |
| 3 | `dbo.NCCRCEmergencyNotification` | Clinical/operational entity in Patient Communications |
| 4 | `dbo.SMSConsent` | Clinical/operational entity in Patient Communications |
| 5 | `dbo.SMSTextConsentForm` | Clinical/operational entity in Patient Communications |
| 6 | `dbo.TravelNotificationLetterTurk` | Clinical/operational entity in Patient Communications |
| 7 | `dbo.TravelNotificationLetterTurkProhibitionofRedisclosure` | Clinical/operational entity in Patient Communications |
| 8 | `dbo.tblDAANESNotification` | Clinical/operational entity in Patient Communications |
| 9 | `dbo.tblNOTIFICATIONS` | Clinical/operational entity in Patient Communications |
| 10 | `dbo.tblNotificationSchedule` | Clinical/operational entity in Patient Communications |

### 1.9 Consents, Authorizations & 42 CFR Part 2 Legal Releases (89 tables)
*42 CFR Part 2 digital Releases of Information (ROI), treatment agreements, client acknowledgments, and electronic signature tracking.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ACBHCSInformingMaterialAcknowledg` | Clinical/operational entity in Consents |
| 2 | `dbo.ACBHCSSUDConsent` | Clinical/operational entity in Consents |
| 3 | `dbo.ACBHIncidentalDisclosureCltAck` | Clinical/operational entity in Consents |
| 4 | `dbo.AcknowledgementReceiptMaterial` | Clinical/operational entity in Consents |
| 5 | `dbo.AdmissionAgreement` | Clinical/operational entity in Consents |
| 6 | `dbo.AuthorizationToDiscloseSubstanceUseTIFCOC` | Clinical/operational entity in Consents |
| 7 | `dbo.BHRDAcknowledgement` | Clinical/operational entity in Consents |
| 8 | `dbo.BHSConsentforServices` | Clinical/operational entity in Consents |
| 9 | `dbo.CAConsentToDisclose` | Clinical/operational entity in Consents |
| 10 | `dbo.CAConsentToDiscloseClinicAddress` | Clinical/operational entity in Consents |
| 11 | `dbo.CAPregnancyAcknowledgment` | Clinical/operational entity in Consents |
| 12 | `dbo.CedarRecoveryCostofServicesAgreement` | Clinical/operational entity in Consents |
| 13 | `dbo.ConsentAndAuthorizationforDisclosureofSUD` | Clinical/operational entity in Consents |
| 14 | `dbo.ConsentCentralRegistryColorado` | Clinical/operational entity in Consents |
| 15 | `dbo.ConsentCentralRegistryLouisiana` | Clinical/operational entity in Consents |
| 16 | `dbo.ConsentExpiresDetails` | Clinical/operational entity in Consents |
| 17 | `dbo.ConsentForCounseling` | Clinical/operational entity in Consents |
| 18 | `dbo.ConsentForFollowUpContact` | Clinical/operational entity in Consents |
| 19 | `dbo.ConsentForReleaseOfConfidentialInfo` | Clinical/operational entity in Consents |
| 20 | `dbo.ConsentParticipationCentralRegistry` | Clinical/operational entity in Consents |
| 21 | `dbo.ConsentReleaseEmergencyContact` | Clinical/operational entity in Consents |
| 22 | `dbo.ConsentReleaseEmergencyContact_Bak` | Clinical/operational entity in Consents |
| 23 | `dbo.ConsentReleasePrescriptionInformation` | Clinical/operational entity in Consents |
| 24 | `dbo.ConsentToDisInfoMultipleRegiMaint` | Clinical/operational entity in Consents |
| 25 | `dbo.ConsentToDiscloseAssignmentofBenefits` | Clinical/operational entity in Consents |
| 26 | `dbo.ConsentToMessachusettsCentralRegistry` | Clinical/operational entity in Consents |
| 27 | `dbo.ConsentToParticipateInTelecounselingV1` | Clinical/operational entity in Consents |
| 28 | `dbo.ConsentToReleaseToMedicalAssistance` | Clinical/operational entity in Consents |
| 29 | `dbo.ConsentToTreatment` | Clinical/operational entity in Consents |
| 30 | `dbo.ConsentToTreatmentWithAnApprovedNarcotic` | Clinical/operational entity in Consents |
| 31 | `dbo.ConsentToTreatmentWithAnApprovedNarcotic_bak03292026` | Clinical/operational entity in Consents |
| 32 | `dbo.ConsentforCommunication` | Clinical/operational entity in Consents |
| 33 | `dbo.ConsentforReleaseConInfoHosp` | Clinical/operational entity in Consents |
| 34 | `dbo.ConsentforReleaseConInfoHospClinicRecords` | Clinical/operational entity in Consents |
| 35 | `dbo.ConsentforReleaseConInfoRevised` | Clinical/operational entity in Consents |
| 36 | `dbo.ConsenttoMarketing` | Clinical/operational entity in Consents |
| 37 | `dbo.ConsenttoParticipateinCentralRegistry` | Clinical/operational entity in Consents |
| 38 | `dbo.ConsenttoReceiveCommunication` | Clinical/operational entity in Consents |
| 39 | `dbo.ConsenttoTransferBetweenOTPandOBOT` | Clinical/operational entity in Consents |
| 40 | `dbo.ConsenttoTreatmentforIOPOrEOPOrOP` | Clinical/operational entity in Consents |
| 41 | `dbo.ConsenttoparticipateinTelecounselingV1New` | Clinical/operational entity in Consents |
| 42 | `dbo.DPHconsentfortreatment` | Clinical/operational entity in Consents |
| 43 | `dbo.EDCODSReceiptEnglish` | Clinical/operational entity in Consents |
| 44 | `dbo.EDCODSReceiptSpanish` | Clinical/operational entity in Consents |
| 45 | `dbo.FinancialagreementNHV3` | Clinical/operational entity in Consents |
| 46 | `dbo.FinancialagreementV3` | Clinical/operational entity in Consents |
| 47 | `dbo.GAConsentCentralRegistryGeorgia` | Clinical/operational entity in Consents |
| 48 | `dbo.GAConsenttoTreatmentwithanApprovedNarcotic` | Clinical/operational entity in Consents |
| 49 | `dbo.GAInformedConsent` | Clinical/operational entity in Consents |
| 50 | `dbo.GeneralConsent` | Clinical/operational entity in Consents |
| 51 | `dbo.GeneralConsentAuthforReleaseInfo` | Clinical/operational entity in Consents |
| 52 | `dbo.KYConsentPhotographSurveillance` | Clinical/operational entity in Consents |
| 53 | `dbo.KYConsentToDiscloseSUDMedicaid` | Clinical/operational entity in Consents |
| 54 | `dbo.KYMedicaidMemberRightsResponsibilities` | Clinical/operational entity in Consents |
| 55 | `dbo.KYMedicaidNonCoveredServicesConsent` | Clinical/operational entity in Consents |
| 56 | `dbo.KentuckyMedicalRecordsRelease` | Clinical/operational entity in Consents |
| 57 | `dbo.MDAuthorizationtoDiscloseSubstanceUseTreatment` | Clinical/operational entity in Consents |
| 58 | `dbo.MIRecipientRights` | Clinical/operational entity in Consents |
| 59 | `dbo.MOConsentCentralRegistryMissouri` | Clinical/operational entity in Consents |
| 60 | `dbo.NCConsentAuthDisclosureSubDisorder` | Clinical/operational entity in Consents |
| 61 | `dbo.NCConsenttoCentralRegistry` | Clinical/operational entity in Consents |
| 62 | `dbo.NCConsenttoDisclosetoCentralRegistry` | Clinical/operational entity in Consents |
| 63 | `dbo.PMPConsent` | Clinical/operational entity in Consents |
| 64 | `dbo.ProgramNameForCostofServicesAgreement` | Clinical/operational entity in Consents |
| 65 | `dbo.RNP_AuthorizationToObtainOrRelease` | Clinical/operational entity in Consents |
| 66 | `dbo.RNP_AuthorizationToObtainOrRelease_pop` | Clinical/operational entity in Consents |
| 67 | `dbo.RecordsReleaseForm` | Clinical/operational entity in Consents |
| 68 | `dbo.ReleaseInNetwork` | Clinical/operational entity in Consents |
| 69 | `dbo.ReleaseOutNetwork` | Clinical/operational entity in Consents |
| 70 | `dbo.RequestReleaseofMedicalRecordsV2` | Clinical/operational entity in Consents |
| 71 | `dbo.SCConsentAndAuthorizationforDisclosureofSUD` | Clinical/operational entity in Consents |
| 72 | `dbo.SCConsentForAutopsyROI` | Clinical/operational entity in Consents |
| 73 | `dbo.SCConsentReleaseCentralRegistry` | Clinical/operational entity in Consents |
| 74 | `dbo.SCReleaseForEmergencyGuestDosing` | Clinical/operational entity in Consents |
| 75 | `dbo.SF_ConsentForEmergencyContact` | Clinical/operational entity in Consents |
| 76 | `dbo.SF_ConsentForFollowUp` | Clinical/operational entity in Consents |
| 77 | `dbo.SF_ConsentForRXInfo` | Clinical/operational entity in Consents |
| 78 | `dbo.SF_ConsentToArrestDetention` | Clinical/operational entity in Consents |
| 79 | `dbo.SF_DetoxificationAcknowledgement` | Clinical/operational entity in Consents |
| 80 | `dbo.tblCONSENT` | Clinical/operational entity in Consents |
| 81 | `dbo.tblCONSENTDETAIL` | Clinical/operational entity in Consents |
| 82 | `dbo.tblCONSENTHEADER` | Clinical/operational entity in Consents |
| 83 | `dbo.tblConsentToPhoneCallsTextMessagesEmails` | Clinical/operational entity in Consents |
| 84 | `dbo.tblConsentforReleaseConInfoRevoc` | Clinical/operational entity in Consents |
| 85 | `dbo.tblFinancialAgreement` | Clinical/operational entity in Consents |
| 86 | `dbo.tblGeneralConsentAuthClinic` | Clinical/operational entity in Consents |
| 87 | `dbo.tblReceiptNum` | Clinical/operational entity in Consents |
| 88 | `dbo.tblUSERTEMPLATERIGHTS` | Clinical/operational entity in Consents |
| 89 | `dbo.tblconsents` | Clinical/operational entity in Consents |

### 1.10 Billing, Claims, Payers, 837/835 EDI & Fee Schedules (268 tables)
*Medicaid & commercial billing, EDI 270/271 real-time eligibility, EDI 837/835 claim batches, third-party billing (3p), fee schedules, copay invoices, and financial hardship.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ACBHCSSUDUpdateDischargeForm` | Clinical/operational entity in Billing |
| 2 | `dbo.BillTypeMaster` | Clinical/operational entity in Billing |
| 3 | `dbo.BillingAssignmentOfBenefits` | Clinical/operational entity in Billing |
| 4 | `dbo.BillingAssignmentOfBenefitsAddress` | Clinical/operational entity in Billing |
| 5 | `dbo.BillingAssignmentOfBenefitsPrivateProviderDetails` | Clinical/operational entity in Billing |
| 6 | `dbo.DischargeServicesCriteriaTable` | Clinical/operational entity in Billing |
| 7 | `dbo.DischargeSummary` | Clinical/operational entity in Billing |
| 8 | `dbo.FinancialHardshipApplication` | Clinical/operational entity in Billing |
| 9 | `dbo.Financial_Info` | Clinical/operational entity in Billing |
| 10 | `dbo.InsuranceFinancialApplication` | Clinical/operational entity in Billing |
| 11 | `dbo.MedicaidFinancialApplication` | Clinical/operational entity in Billing |
| 12 | `dbo.NVDischargeSupplementalForm` | Clinical/operational entity in Billing |
| 13 | `dbo.NVDischargeSupplementalMaster` | Clinical/operational entity in Billing |
| 14 | `dbo.OptumUninsuredEligibility` | Clinical/operational entity in Billing |
| 15 | `dbo.PrimaryDischargeReason` | Clinical/operational entity in Billing |
| 16 | `dbo.SF_PostDischargeFollowUp` | Clinical/operational entity in Billing |
| 17 | `dbo.SUDOutcomeToolDischarge` | Clinical/operational entity in Billing |
| 18 | `dbo.SecondaryDischargeReason` | Clinical/operational entity in Billing |
| 19 | `dbo.TblDartssrv_export` | Clinical/operational entity in Billing |
| 20 | `dbo.VOBEligibility` | Clinical/operational entity in Billing |
| 21 | `dbo.claim_information` | Clinical/operational entity in Billing |
| 22 | `dbo.payment_info` | Clinical/operational entity in Billing |
| 23 | `dbo.tbl270FILEID` | Clinical/operational entity in Billing |
| 24 | `dbo.tbl3PAYPROG` | Clinical/operational entity in Billing |
| 25 | `dbo.tbl3PAYauth` | Clinical/operational entity in Billing |
| 26 | `dbo.tbl3PClaim_ChangeLog` | Clinical/operational entity in Billing |
| 27 | `dbo.tbl3PSETUP` | Clinical/operational entity in Billing |
| 28 | `dbo.tbl3PSRVFEE` | Clinical/operational entity in Billing |
| 29 | `dbo.tbl3pBill` | Clinical/operational entity in Billing |
| 30 | `dbo.tbl3pClaim` | Clinical/operational entity in Billing |
| 31 | `dbo.tbl3pClaimBatch` | Clinical/operational entity in Billing |
| 32 | `dbo.tbl3pClaimBatchEncounter` | Clinical/operational entity in Billing |
| 33 | `dbo.tbl3pClaimLineItem` | Clinical/operational entity in Billing |
| 34 | `dbo.tbl3pClaimLineItemActivity` | Clinical/operational entity in Billing |
| 35 | `dbo.tbl3pClaimLineItemActivity_1stMay2025` | Clinical/operational entity in Billing |
| 36 | `dbo.tbl3pClaimLineItem_Test` | Clinical/operational entity in Billing |
| 37 | `dbo.tbl3pClaimRemit` | Clinical/operational entity in Billing |
| 38 | `dbo.tbl3pClaim_Test` | Clinical/operational entity in Billing |
| 39 | `dbo.tbl3pCoIns` | Clinical/operational entity in Billing |
| 40 | `dbo.tbl3pCodes` | Clinical/operational entity in Billing |
| 41 | `dbo.tbl3pElig` | Clinical/operational entity in Billing |
| 42 | `dbo.tbl3pEligReq` | Clinical/operational entity in Billing |
| 43 | `dbo.tbl3pGROUP` | Clinical/operational entity in Billing |
| 44 | `dbo.tbl3pLineItem` | Clinical/operational entity in Billing |
| 45 | `dbo.tbl3pPAY` | Clinical/operational entity in Billing |
| 46 | `dbo.tbl3pREMITBATCHHEAD` | Clinical/operational entity in Billing |
| 47 | `dbo.tbl3pRemitBatch` | Clinical/operational entity in Billing |
| 48 | `dbo.tbl3pRemitBatchClaim` | Clinical/operational entity in Billing |
| 49 | `dbo.tbl3pRemitLineItem` | Clinical/operational entity in Billing |
| 50 | `dbo.tbl3pRemitUnapplied` | Clinical/operational entity in Billing |
| 51 | `dbo.tbl3pauthtemp` | Clinical/operational entity in Billing |
| 52 | `dbo.tbl3paybenefits` | Clinical/operational entity in Billing |
| 53 | `dbo.tbl835Template` | Clinical/operational entity in Billing |
| 54 | `dbo.tbl837FILEID` | Clinical/operational entity in Billing |
| 55 | `dbo.tblAccts` | Clinical/operational entity in Billing |
| 56 | `dbo.tblAcctsBkup20240107160000` | Clinical/operational entity in Billing |
| 57 | `dbo.tblAcctsBkup20240114160000` | Clinical/operational entity in Billing |
| 58 | `dbo.tblAcctsBkup20240121160000` | Clinical/operational entity in Billing |
| 59 | `dbo.tblAcctsBkup20240128160000` | Clinical/operational entity in Billing |
| 60 | `dbo.tblAcctsBkup20240131220000` | Clinical/operational entity in Billing |
| 61 | `dbo.tblAcctsBkup20240204160000` | Clinical/operational entity in Billing |
| 62 | `dbo.tblAcctsBkup20240211160000` | Clinical/operational entity in Billing |
| 63 | `dbo.tblAcctsBkup20240218160000` | Clinical/operational entity in Billing |
| 64 | `dbo.tblAcctsBkup20240225160000` | Clinical/operational entity in Billing |
| 65 | `dbo.tblAcctsBkup20240229220000` | Clinical/operational entity in Billing |
| 66 | `dbo.tblAcctsBkup20240303160000` | Clinical/operational entity in Billing |
| 67 | `dbo.tblAcctsBkup20240310160001` | Clinical/operational entity in Billing |
| 68 | `dbo.tblAcctsBkup20240317160000` | Clinical/operational entity in Billing |
| 69 | `dbo.tblAcctsBkup20240324160000` | Clinical/operational entity in Billing |
| 70 | `dbo.tblAcctsBkup20240331160001` | Clinical/operational entity in Billing |
| 71 | `dbo.tblAcctsBkup20240407160000` | Clinical/operational entity in Billing |
| 72 | `dbo.tblAcctsBkup20240414160000` | Clinical/operational entity in Billing |
| 73 | `dbo.tblAcctsBkup20240421160001` | Clinical/operational entity in Billing |
| 74 | `dbo.tblAcctsBkup20240428160001` | Clinical/operational entity in Billing |
| 75 | `dbo.tblAcctsBkup20240430220001` | Clinical/operational entity in Billing |
| 76 | `dbo.tblAcctsBkup20240505160000` | Clinical/operational entity in Billing |
| 77 | `dbo.tblAcctsBkup20240512160000` | Clinical/operational entity in Billing |
| 78 | `dbo.tblAcctsBkup20240519160000` | Clinical/operational entity in Billing |
| 79 | `dbo.tblAcctsBkup20240526160000` | Clinical/operational entity in Billing |
| 80 | `dbo.tblAcctsBkup20240531220000` | Clinical/operational entity in Billing |
| 81 | `dbo.tblAcctsBkup20240602160000` | Clinical/operational entity in Billing |
| 82 | `dbo.tblAcctsBkup20240609160000` | Clinical/operational entity in Billing |
| 83 | `dbo.tblAcctsBkup20240616160000` | Clinical/operational entity in Billing |
| 84 | `dbo.tblAcctsBkup20240623160001` | Clinical/operational entity in Billing |
| 85 | `dbo.tblAcctsBkup20240630160000` | Clinical/operational entity in Billing |
| 86 | `dbo.tblAcctsBkup20240707160000` | Clinical/operational entity in Billing |
| 87 | `dbo.tblAcctsBkup20240714160000` | Clinical/operational entity in Billing |
| 88 | `dbo.tblAcctsBkup20240721160000` | Clinical/operational entity in Billing |
| 89 | `dbo.tblAcctsBkup20240728160000` | Clinical/operational entity in Billing |
| 90 | `dbo.tblAcctsBkup20240731220000` | Clinical/operational entity in Billing |
| 91 | `dbo.tblAcctsBkup20240804160001` | Clinical/operational entity in Billing |
| 92 | `dbo.tblAcctsBkup20240811160000` | Clinical/operational entity in Billing |
| 93 | `dbo.tblAcctsBkup20240818160001` | Clinical/operational entity in Billing |
| 94 | `dbo.tblAcctsBkup20240825160000` | Clinical/operational entity in Billing |
| 95 | `dbo.tblAcctsBkup20240831220000` | Clinical/operational entity in Billing |
| 96 | `dbo.tblAcctsBkup20240901160000` | Clinical/operational entity in Billing |
| 97 | `dbo.tblAcctsBkup20240908160000` | Clinical/operational entity in Billing |
| 98 | `dbo.tblAcctsBkup20240915160000` | Clinical/operational entity in Billing |
| 99 | `dbo.tblAcctsBkup20240922160001` | Clinical/operational entity in Billing |
| 100 | `dbo.tblAcctsBkup20240929160000` | Clinical/operational entity in Billing |
| 101 | `dbo.tblAcctsBkup20240930220000` | Clinical/operational entity in Billing |
| 102 | `dbo.tblAcctsBkup20241006160000` | Clinical/operational entity in Billing |
| 103 | `dbo.tblAcctsBkup20241013160000` | Clinical/operational entity in Billing |
| 104 | `dbo.tblAcctsBkup20241020160000` | Clinical/operational entity in Billing |
| 105 | `dbo.tblAcctsBkup20241027160000` | Clinical/operational entity in Billing |
| 106 | `dbo.tblAcctsBkup20241031220000` | Clinical/operational entity in Billing |
| 107 | `dbo.tblAcctsBkup20241103160000` | Clinical/operational entity in Billing |
| 108 | `dbo.tblAcctsBkup20241110160000` | Clinical/operational entity in Billing |
| 109 | `dbo.tblAcctsBkup20241117160000` | Clinical/operational entity in Billing |
| 110 | `dbo.tblAcctsBkup20241124160000` | Clinical/operational entity in Billing |
| 111 | `dbo.tblAcctsBkup20241130220000` | Clinical/operational entity in Billing |
| 112 | `dbo.tblAcctsBkup20241201160000` | Clinical/operational entity in Billing |
| 113 | `dbo.tblAcctsBkup20241208160000` | Clinical/operational entity in Billing |
| 114 | `dbo.tblAcctsBkup20241215160001` | Clinical/operational entity in Billing |
| 115 | `dbo.tblAcctsBkup20241222160000` | Clinical/operational entity in Billing |
| 116 | `dbo.tblAcctsBkup20241229160000` | Clinical/operational entity in Billing |
| 117 | `dbo.tblAcctsBkup20241231220000` | Clinical/operational entity in Billing |
| 118 | `dbo.tblAcctsBkup20250105160001` | Clinical/operational entity in Billing |
| 119 | `dbo.tblAcctsBkup20250112160000` | Clinical/operational entity in Billing |
| 120 | `dbo.tblAcctsBkup20250119160000` | Clinical/operational entity in Billing |
| 121 | `dbo.tblAcctsBkup20250126160000` | Clinical/operational entity in Billing |
| 122 | `dbo.tblAcctsBkup20250131220002` | Clinical/operational entity in Billing |
| 123 | `dbo.tblAcctsBkup20250202160000` | Clinical/operational entity in Billing |
| 124 | `dbo.tblAcctsBkup20250209160000` | Clinical/operational entity in Billing |
| 125 | `dbo.tblAcctsBkup20250216160000` | Clinical/operational entity in Billing |
| 126 | `dbo.tblAcctsBkup20250223160001` | Clinical/operational entity in Billing |
| 127 | `dbo.tblAcctsBkup20250228220000` | Clinical/operational entity in Billing |
| 128 | `dbo.tblAcctsBkup20250302160000` | Clinical/operational entity in Billing |
| 129 | `dbo.tblAcctsBkup20250309160000` | Clinical/operational entity in Billing |
| 130 | `dbo.tblAcctsBkup20250316160001` | Clinical/operational entity in Billing |
| 131 | `dbo.tblAcctsBkup20250323160001` | Clinical/operational entity in Billing |
| 132 | `dbo.tblAcctsBkup20250330160001` | Clinical/operational entity in Billing |
| 133 | `dbo.tblAcctsBkup20250331220001` | Clinical/operational entity in Billing |
| 134 | `dbo.tblAcctsBkup20250406160000` | Clinical/operational entity in Billing |
| 135 | `dbo.tblAcctsBkup20250413160000` | Clinical/operational entity in Billing |
| 136 | `dbo.tblAcctsBkup20250420160001` | Clinical/operational entity in Billing |
| 137 | `dbo.tblAcctsBkup20250427160000` | Clinical/operational entity in Billing |
| 138 | `dbo.tblAcctsBkup20250430220000` | Clinical/operational entity in Billing |
| 139 | `dbo.tblAcctsBkup20250504160000` | Clinical/operational entity in Billing |
| 140 | `dbo.tblAcctsBkup20250511160000` | Clinical/operational entity in Billing |
| 141 | `dbo.tblAcctsBkup20250518160001` | Clinical/operational entity in Billing |
| 142 | `dbo.tblAcctsBkup20250525160000` | Clinical/operational entity in Billing |
| 143 | `dbo.tblAcctsBkup20250531220002` | Clinical/operational entity in Billing |
| 144 | `dbo.tblAcctsBkup20250601160000` | Clinical/operational entity in Billing |
| 145 | `dbo.tblAcctsBkup20250608160000` | Clinical/operational entity in Billing |
| 146 | `dbo.tblAcctsBkup20250615160001` | Clinical/operational entity in Billing |
| 147 | `dbo.tblAcctsBkup20250622160001` | Clinical/operational entity in Billing |
| 148 | `dbo.tblAcctsBkup20250629160000` | Clinical/operational entity in Billing |
| 149 | `dbo.tblAcctsBkup20250630220000` | Clinical/operational entity in Billing |
| 150 | `dbo.tblAcctsBkup20250706160000` | Clinical/operational entity in Billing |
| 151 | `dbo.tblAcctsBkup20250713160000` | Clinical/operational entity in Billing |
| 152 | `dbo.tblAcctsBkup20250720160000` | Clinical/operational entity in Billing |
| 153 | `dbo.tblAcctsBkup20250727160000` | Clinical/operational entity in Billing |
| 154 | `dbo.tblAcctsBkup20250731220001` | Clinical/operational entity in Billing |
| 155 | `dbo.tblAcctsBkup20250803160001` | Clinical/operational entity in Billing |
| 156 | `dbo.tblAcctsBkup20250810160000` | Clinical/operational entity in Billing |
| 157 | `dbo.tblAcctsBkup20250817160000` | Clinical/operational entity in Billing |
| 158 | `dbo.tblAcctsBkup20250824160001` | Clinical/operational entity in Billing |
| 159 | `dbo.tblAcctsBkup20250831160000` | Clinical/operational entity in Billing |
| 160 | `dbo.tblAcctsBkup20250907160000` | Clinical/operational entity in Billing |
| 161 | `dbo.tblAcctsBkup20250914160000` | Clinical/operational entity in Billing |
| 162 | `dbo.tblAcctsBkup20250921160000` | Clinical/operational entity in Billing |
| 163 | `dbo.tblAcctsBkup20250928160001` | Clinical/operational entity in Billing |
| 164 | `dbo.tblAcctsBkup20250930220000` | Clinical/operational entity in Billing |
| 165 | `dbo.tblAcctsBkup20251005160000` | Clinical/operational entity in Billing |
| 166 | `dbo.tblAcctsBkup20251012160000` | Clinical/operational entity in Billing |
| 167 | `dbo.tblAcctsBkup20251019160001` | Clinical/operational entity in Billing |
| 168 | `dbo.tblAcctsBkup20251026160000` | Clinical/operational entity in Billing |
| 169 | `dbo.tblAcctsBkup20251031220000` | Clinical/operational entity in Billing |
| 170 | `dbo.tblAcctsBkup20251102160000` | Clinical/operational entity in Billing |
| 171 | `dbo.tblAcctsBkup20251109160000` | Clinical/operational entity in Billing |
| 172 | `dbo.tblAcctsBkup20251116160000` | Clinical/operational entity in Billing |
| 173 | `dbo.tblAcctsBkup20251123160000` | Clinical/operational entity in Billing |
| 174 | `dbo.tblAcctsBkup20251130160000` | Clinical/operational entity in Billing |
| 175 | `dbo.tblAcctsBkup20251207160000` | Clinical/operational entity in Billing |
| 176 | `dbo.tblAcctsBkup20251214160000` | Clinical/operational entity in Billing |
| 177 | `dbo.tblAcctsBkup20251221160000` | Clinical/operational entity in Billing |
| 178 | `dbo.tblAcctsBkup20251228160000` | Clinical/operational entity in Billing |
| 179 | `dbo.tblAcctsBkup20251231220000` | Clinical/operational entity in Billing |
| 180 | `dbo.tblAcctsBkup20260104160000` | Clinical/operational entity in Billing |
| 181 | `dbo.tblAcctsBkup20260111160000` | Clinical/operational entity in Billing |
| 182 | `dbo.tblAcctsBkup20260118160000` | Clinical/operational entity in Billing |
| 183 | `dbo.tblAcctsBkup20260125160001` | Clinical/operational entity in Billing |
| 184 | `dbo.tblAcctsBkup20260131220000` | Clinical/operational entity in Billing |
| 185 | `dbo.tblAcctsBkup20260201160000` | Clinical/operational entity in Billing |
| 186 | `dbo.tblAcctsBkup20260208160000` | Clinical/operational entity in Billing |
| 187 | `dbo.tblAcctsBkup20260215160000` | Clinical/operational entity in Billing |
| 188 | `dbo.tblAcctsBkup20260222160000` | Clinical/operational entity in Billing |
| 189 | `dbo.tblAcctsBkup20260228220001` | Clinical/operational entity in Billing |
| 190 | `dbo.tblAcctsBkup20260301160000` | Clinical/operational entity in Billing |
| 191 | `dbo.tblAcctsBkup20260308160000` | Clinical/operational entity in Billing |
| 192 | `dbo.tblAcctsBkup20260315160000` | Clinical/operational entity in Billing |
| 193 | `dbo.tblAcctsBkup20260322160000` | Clinical/operational entity in Billing |
| 194 | `dbo.tblAcctsBkup20260329160000` | Clinical/operational entity in Billing |
| 195 | `dbo.tblAcctsBkup20260331220001` | Clinical/operational entity in Billing |
| 196 | `dbo.tblAcctsBkup20260405160000` | Clinical/operational entity in Billing |
| 197 | `dbo.tblAcctsBkup20260412160000` | Clinical/operational entity in Billing |
| 198 | `dbo.tblAcctsBkup20260419160000` | Clinical/operational entity in Billing |
| 199 | `dbo.tblAcctsBkup20260426160000` | Clinical/operational entity in Billing |
| 200 | `dbo.tblAcctsBkup20260430220000` | Clinical/operational entity in Billing |
| 201 | `dbo.tblAcctsBkup20260503160000` | Clinical/operational entity in Billing |
| 202 | `dbo.tblAcctsBkup20260510160000` | Clinical/operational entity in Billing |
| 203 | `dbo.tblAcctsBkup20260517160000` | Clinical/operational entity in Billing |
| 204 | `dbo.tblAcctsBkup20260524160000` | Clinical/operational entity in Billing |
| 205 | `dbo.tblAcctsBkup20260531160000` | Clinical/operational entity in Billing |
| 206 | `dbo.tblAcctsBkup20260607160001` | Clinical/operational entity in Billing |
| 207 | `dbo.tblAcctsBkup20260614160000` | Clinical/operational entity in Billing |
| 208 | `dbo.tblAcctsBkup20260621160001` | Clinical/operational entity in Billing |
| 209 | `dbo.tblAcctsBkup20260628160000` | Clinical/operational entity in Billing |
| 210 | `dbo.tblAcctsBkup20260630220000` | Clinical/operational entity in Billing |
| 211 | `dbo.tblAcctsBkup20260705160000` | Clinical/operational entity in Billing |
| 212 | `dbo.tblAcctsBkup20260712160000` | Clinical/operational entity in Billing |
| 213 | `dbo.tblAcctsBkup20260719160000` | Clinical/operational entity in Billing |
| 214 | `dbo.tblAcctsBkup20260726160001` | Clinical/operational entity in Billing |
| 215 | `dbo.tblAcctsBkup20260731220000` | Clinical/operational entity in Billing |
| 216 | `dbo.tblAcctsBkup20260802160001` | Clinical/operational entity in Billing |
| 217 | `dbo.tblAcctsBkup20260809160000` | Clinical/operational entity in Billing |
| 218 | `dbo.tblAcctsBkup20260816160000` | Clinical/operational entity in Billing |
| 219 | `dbo.tblAcctsBkup20260823160000` | Clinical/operational entity in Billing |
| 220 | `dbo.tblAcctsBkup20260830160000` | Clinical/operational entity in Billing |
| 221 | `dbo.tblAcctsBkup20260831220000` | Clinical/operational entity in Billing |
| 222 | `dbo.tblAcctsBkup20260906160000` | Clinical/operational entity in Billing |
| 223 | `dbo.tblAcctsBkup20260913160000` | Clinical/operational entity in Billing |
| 224 | `dbo.tblAcctsBkup20260920160000` | Clinical/operational entity in Billing |
| 225 | `dbo.tblAcctsNums` | Clinical/operational entity in Billing |
| 226 | `dbo.tblAdmissionDischarge` | Clinical/operational entity in Billing |
| 227 | `dbo.tblBill` | Clinical/operational entity in Billing |
| 228 | `dbo.tblBillActg` | Clinical/operational entity in Billing |
| 229 | `dbo.tblBillBackupDeletedDeepak033125` | Clinical/operational entity in Billing |
| 230 | `dbo.tblBillDay` | Clinical/operational entity in Billing |
| 231 | `dbo.tblBillFIFO` | Clinical/operational entity in Billing |
| 232 | `dbo.tblBillFIFOBackup070925` | Clinical/operational entity in Billing |
| 233 | `dbo.tblBillFIFOBackupx052826` | Clinical/operational entity in Billing |
| 234 | `dbo.tblBillFIFOBackupx121225` | Clinical/operational entity in Billing |
| 235 | `dbo.tblBillFifoBackup031124` | Clinical/operational entity in Billing |
| 236 | `dbo.tblBillPending` | Clinical/operational entity in Billing |
| 237 | `dbo.tblBill_Adjustments_Backup_20260805` | Clinical/operational entity in Billing |
| 238 | `dbo.tblCLAIMDETAIL` | Clinical/operational entity in Billing |
| 239 | `dbo.tblCLAIMS` | Clinical/operational entity in Billing |
| 240 | `dbo.tblDARTSREJECT` | Clinical/operational entity in Billing |
| 241 | `dbo.tblDartsCodes` | Clinical/operational entity in Billing |
| 242 | `dbo.tblDartsProvider` | Clinical/operational entity in Billing |
| 243 | `dbo.tblDartsSrv` | Clinical/operational entity in Billing |
| 244 | `dbo.tblDartsSrvRevisions` | Clinical/operational entity in Billing |
| 245 | `dbo.tblDartsSrvSubmit` | Clinical/operational entity in Billing |
| 246 | `dbo.tblDartsSrv_04222026` | Clinical/operational entity in Billing |
| 247 | `dbo.tblDartsSrv_05042026` | Clinical/operational entity in Billing |
| 248 | `dbo.tblDartsSrv_05082026` | Clinical/operational entity in Billing |
| 249 | `dbo.tblDartsSrv_10thApril2025` | Clinical/operational entity in Billing |
| 250 | `dbo.tblDartsSrv_10thFeb2026_Test` | Clinical/operational entity in Billing |
| 251 | `dbo.tblDartsSrv_10thFeb2026_TestB` | Clinical/operational entity in Billing |
| 252 | `dbo.tblDartsSrv_10thFeb2026_TestC` | Clinical/operational entity in Billing |
| 253 | `dbo.tblDartsSrv_10thFeb2026_TestD` | Clinical/operational entity in Billing |
| 254 | `dbo.tblDartsSrv_12thFeb2025` | Clinical/operational entity in Billing |
| 255 | `dbo.tblDartsSrv_3rdApril2025` | Clinical/operational entity in Billing |
| 256 | `dbo.tblDartsSubmit` | Clinical/operational entity in Billing |
| 257 | `dbo.tblDischargeForm` | Clinical/operational entity in Billing |
| 258 | `dbo.tblDischargeProgramdropdown` | Clinical/operational entity in Billing |
| 259 | `dbo.tblDischargeReasondropdown` | Clinical/operational entity in Billing |
| 260 | `dbo.tblPAYERCLT` | Clinical/operational entity in Billing |
| 261 | `dbo.tblPENDINGCLAIMS` | Clinical/operational entity in Billing |
| 262 | `dbo.tblProgramBilling` | Clinical/operational entity in Billing |
| 263 | `dbo.tblProgramBillingIncome` | Clinical/operational entity in Billing |
| 264 | `dbo.tblTPdischarge` | Clinical/operational entity in Billing |
| 265 | `dbo.tblclaimstatus` | Clinical/operational entity in Billing |
| 266 | `dbo.tblclaimstatus_AutoBilling` | Clinical/operational entity in Billing |
| 267 | `dbo.tbltempUNBILLED` | Clinical/operational entity in Billing |
| 268 | `dbo.vw3pauthtemptable` | Clinical/operational entity in Billing |

### 1.11 Clinic Facilities, Treatment Centers & Operating Rules (20 tables)
*BHG treatment center facilities (Knoxville, Jackson, etc.), site programs, service locations, operating hours, and county configurations.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.CLINIC59_INSURANCE` | Clinical/operational entity in Clinic Facilities |
| 2 | `dbo.CompositeScores` | Clinical/operational entity in Clinic Facilities |
| 3 | `dbo.DTPFormClinicalSummaryReferral` | Clinical/operational entity in Clinic Facilities |
| 4 | `dbo.FresnoCountyMedical` | Clinical/operational entity in Clinic Facilities |
| 5 | `dbo.FresnoCountyYouthSUD` | Clinical/operational entity in Clinic Facilities |
| 6 | `dbo.INClinicalMedicalReview` | Clinical/operational entity in Clinic Facilities |
| 7 | `dbo.InitialCompAssesClinicalInterpretiveSummary` | Clinical/operational entity in Clinic Facilities |
| 8 | `dbo.LosAngelesCountyBHS` | Clinical/operational entity in Clinic Facilities |
| 9 | `dbo.NewDTPFormClinicalSummaryReferral` | Clinical/operational entity in Clinic Facilities |
| 10 | `dbo.OpioidTretamentProgram` | Clinical/operational entity in Clinic Facilities |
| 11 | `dbo.OpioidTretamentProgramCurrentRxOrders` | Clinical/operational entity in Clinic Facilities |
| 12 | `dbo.ProgramFormMapping` | Clinical/operational entity in Clinic Facilities |
| 13 | `dbo.SF_OnSiteVerficationTest` | Clinical/operational entity in Clinic Facilities |
| 14 | `dbo.SF_Program` | Clinical/operational entity in Clinic Facilities |
| 15 | `dbo.tblCLINIC` | Clinical/operational entity in Clinic Facilities |
| 16 | `dbo.tblProgram_Export` | Clinical/operational entity in Clinic Facilities |
| 17 | `dbo.tblReceivingPrograms` | Clinical/operational entity in Clinic Facilities |
| 18 | `dbo.tblReferralClinics` | Clinical/operational entity in Clinic Facilities |
| 19 | `dbo.tblSITES` | Clinical/operational entity in Clinic Facilities |
| 20 | `dbo.tblclinicglobalNOT` | Clinical/operational entity in Clinic Facilities |

### 1.12 Clinical Staff, Providers, Credentials & User Security (9 tables)
*Counselors, physicians, nursing staff, CADC/LCADC credentials, NPI registrations, user permissions, and avatar identifiers.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ScxUserESig` | Clinical/operational entity in Clinical Staff |
| 2 | `dbo.UserLogins` | Clinical/operational entity in Clinical Staff |
| 3 | `dbo.tblDoctorsOrder` | Clinical/operational entity in Clinical Staff |
| 4 | `dbo.tblSCHEDUSER` | Clinical/operational entity in Clinical Staff |
| 5 | `dbo.tblUSERSEC` | Clinical/operational entity in Clinical Staff |
| 6 | `dbo.tblUSERTEMPLATE` | Clinical/operational entity in Clinical Staff |
| 7 | `dbo.tblUserGroups` | Clinical/operational entity in Clinical Staff |
| 8 | `dbo.tblUserNOT` | Clinical/operational entity in Clinical Staff |
| 9 | `dbo.tblUserV4old` | Clinical/operational entity in Clinical Staff |

### 1.13 Dynamic Forms Engine, Question-and-Answer & Templates (83 tables)
*Dynamic clinical form builders, form layouts, calculation scripts, question-answer pairs, and assessment versioning.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.Answer` | Clinical/operational entity in Dynamic Forms Engine |
| 2 | `dbo.AnswerSignature` | Clinical/operational entity in Dynamic Forms Engine |
| 3 | `dbo.AuditForm` | Clinical/operational entity in Dynamic Forms Engine |
| 4 | `dbo.BriefTraumaQuestionnaire` | Clinical/operational entity in Dynamic Forms Engine |
| 5 | `dbo.DCSupplementalForm` | Clinical/operational entity in Dynamic Forms Engine |
| 6 | `dbo.DTPFormProblem` | Clinical/operational entity in Dynamic Forms Engine |
| 7 | `dbo.DTPFormReferral` | Clinical/operational entity in Dynamic Forms Engine |
| 8 | `dbo.DTPFormRxOrder` | Clinical/operational entity in Dynamic Forms Engine |
| 9 | `dbo.DTPFormServices` | Clinical/operational entity in Dynamic Forms Engine |
| 10 | `dbo.DTPFormSocioEconomicConditions` | Clinical/operational entity in Dynamic Forms Engine |
| 11 | `dbo.DTPFormTreatmentEpisodeSummary` | Clinical/operational entity in Dynamic Forms Engine |
| 12 | `dbo.DeletedForms` | Clinical/operational entity in Dynamic Forms Engine |
| 13 | `dbo.DynamicAnswer` | Clinical/operational entity in Dynamic Forms Engine |
| 14 | `dbo.DynamicControls` | Clinical/operational entity in Dynamic Forms Engine |
| 15 | `dbo.DynamicForms` | Clinical/operational entity in Dynamic Forms Engine |
| 16 | `dbo.DynamicQuestion` | Clinical/operational entity in Dynamic Forms Engine |
| 17 | `dbo.EmergencyMedicalInformation` | Clinical/operational entity in Dynamic Forms Engine |
| 18 | `dbo.Form` | Clinical/operational entity in Dynamic Forms Engine |
| 19 | `dbo.FormCompletion` | Clinical/operational entity in Dynamic Forms Engine |
| 20 | `dbo.FormData` | Clinical/operational entity in Dynamic Forms Engine |
| 21 | `dbo.FormRevocation` | Clinical/operational entity in Dynamic Forms Engine |
| 22 | `dbo.FormSetting` | Clinical/operational entity in Dynamic Forms Engine |
| 23 | `dbo.FormSetting_bak_10252024` | Clinical/operational entity in Dynamic Forms Engine |
| 24 | `dbo.FormTemplate` | Clinical/operational entity in Dynamic Forms Engine |
| 25 | `dbo.FormTemplate_01162026` | Clinical/operational entity in Dynamic Forms Engine |
| 26 | `dbo.FormTemplate_12152025` | Clinical/operational entity in Dynamic Forms Engine |
| 27 | `dbo.GeneralInformation` | Clinical/operational entity in Dynamic Forms Engine |
| 28 | `dbo.GeneralInformations` | Clinical/operational entity in Dynamic Forms Engine |
| 29 | `dbo.HL7ADTInformation` | Clinical/operational entity in Dynamic Forms Engine |
| 30 | `dbo.ILHIVForm` | Clinical/operational entity in Dynamic Forms Engine |
| 31 | `dbo.InformationSheetorFaceSheet` | Clinical/operational entity in Dynamic Forms Engine |
| 32 | `dbo.InformationaboutMAT` | Clinical/operational entity in Dynamic Forms Engine |
| 33 | `dbo.InitialCompAssesChildreninformation` | Clinical/operational entity in Dynamic Forms Engine |
| 34 | `dbo.InitialCompAssesSeriesOfQuestions` | Clinical/operational entity in Dynamic Forms Engine |
| 35 | `dbo.LOCPAForm` | Clinical/operational entity in Dynamic Forms Engine |
| 36 | `dbo.LOCPAFormCommon` | Clinical/operational entity in Dynamic Forms Engine |
| 37 | `dbo.MCRC42CFRPart2andHIPAAForm` | Clinical/operational entity in Dynamic Forms Engine |
| 38 | `dbo.MSWInformation` | Clinical/operational entity in Dynamic Forms Engine |
| 39 | `dbo.MedicalFormOrService` | Clinical/operational entity in Dynamic Forms Engine |
| 40 | `dbo.NewDTPFormProblem` | Clinical/operational entity in Dynamic Forms Engine |
| 41 | `dbo.NewDTPFormReferral` | Clinical/operational entity in Dynamic Forms Engine |
| 42 | `dbo.NewDTPFormRxOrder` | Clinical/operational entity in Dynamic Forms Engine |
| 43 | `dbo.NewDTPFormSocioEconomicConditions` | Clinical/operational entity in Dynamic Forms Engine |
| 44 | `dbo.NewDTPFormTreatmentEpisodeSummary` | Clinical/operational entity in Dynamic Forms Engine |
| 45 | `dbo.NoLoiteringformRevised` | Clinical/operational entity in Dynamic Forms Engine |
| 46 | `dbo.PDFQuestions` | Clinical/operational entity in Dynamic Forms Engine |
| 47 | `dbo.Question` | Clinical/operational entity in Dynamic Forms Engine |
| 48 | `dbo.QuestionAnswerOption` | Clinical/operational entity in Dynamic Forms Engine |
| 49 | `dbo.ReferralForm` | Clinical/operational entity in Dynamic Forms Engine |
| 50 | `dbo.SF_DataForms` | Clinical/operational entity in Dynamic Forms Engine |
| 51 | `dbo.SF_dataforms_01162026` | Clinical/operational entity in Dynamic Forms Engine |
| 52 | `dbo.SF_dataforms_12152025` | Clinical/operational entity in Dynamic Forms Engine |
| 53 | `dbo.SSRSForm` | Clinical/operational entity in Dynamic Forms Engine |
| 54 | `dbo.ScxFormMapping` | Clinical/operational entity in Dynamic Forms Engine |
| 55 | `dbo.Service_Information` | Clinical/operational entity in Dynamic Forms Engine |
| 56 | `dbo.SigFormDetails` | Clinical/operational entity in Dynamic Forms Engine |
| 57 | `dbo.SingnatureForm` | Clinical/operational entity in Dynamic Forms Engine |
| 58 | `dbo.StateFactForm` | Clinical/operational entity in Dynamic Forms Engine |
| 59 | `dbo.TEDSSubmissionForm` | Clinical/operational entity in Dynamic Forms Engine |
| 60 | `dbo.TblFormsContents` | Clinical/operational entity in Dynamic Forms Engine |
| 61 | `dbo.TreatmentFormAlertMappings` | Clinical/operational entity in Dynamic Forms Engine |
| 62 | `dbo.TreatmentFormAlertMappings_01162026` | Clinical/operational entity in Dynamic Forms Engine |
| 63 | `dbo.TreatmentFormAlertMappings_10042024` | Clinical/operational entity in Dynamic Forms Engine |
| 64 | `dbo.TreatmentFormAlertMappings_12152025` | Clinical/operational entity in Dynamic Forms Engine |
| 65 | `dbo.VoidForm` | Clinical/operational entity in Dynamic Forms Engine |
| 66 | `dbo.VoterPreferenceForm` | Clinical/operational entity in Dynamic Forms Engine |
| 67 | `dbo.formsetting_bak_01142026` | Clinical/operational entity in Dynamic Forms Engine |
| 68 | `dbo.formsetting_bak_03172025` | Clinical/operational entity in Dynamic Forms Engine |
| 69 | `dbo.formsetting_bak_09022026` | Clinical/operational entity in Dynamic Forms Engine |
| 70 | `dbo.sigformdetails_bak_10252024` | Clinical/operational entity in Dynamic Forms Engine |
| 71 | `dbo.singnatureform_bak_10252024` | Clinical/operational entity in Dynamic Forms Engine |
| 72 | `dbo.tblCUSTOMANSWERS` | Clinical/operational entity in Dynamic Forms Engine |
| 73 | `dbo.tblCUSTOMQUESTIONS` | Clinical/operational entity in Dynamic Forms Engine |
| 74 | `dbo.tblCUSTOMQUESTIONS1` | Clinical/operational entity in Dynamic Forms Engine |
| 75 | `dbo.tblConfigForms` | Clinical/operational entity in Dynamic Forms Engine |
| 76 | `dbo.tblControls` | Clinical/operational entity in Dynamic Forms Engine |
| 77 | `dbo.tblCustomOrderTemplate` | Clinical/operational entity in Dynamic Forms Engine |
| 78 | `dbo.tblEKGReferralForm` | Clinical/operational entity in Dynamic Forms Engine |
| 79 | `dbo.tblGENERALFORMS` | Clinical/operational entity in Dynamic Forms Engine |
| 80 | `dbo.tblORDERREQQuestions` | Clinical/operational entity in Dynamic Forms Engine |
| 81 | `dbo.tblORDERREQQuestionsback` | Clinical/operational entity in Dynamic Forms Engine |
| 82 | `dbo.tblQAQUESTIONS` | Clinical/operational entity in Dynamic Forms Engine |
| 83 | `dbo.treatmentformalerts_bak_10252024` | Clinical/operational entity in Dynamic Forms Engine |

### 1.14 System Background Jobs, Batch Queues & Audit Logs (33 tables)
*Background schedulers, audit trail tracking, data scrubbers, schema version history, and integration error logs.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ActiveMedicalProblems` | Clinical/operational entity in System Background Jobs |
| 2 | `dbo.AdvanceDirective` | Clinical/operational entity in System Background Jobs |
| 3 | `dbo.ChronicMedicine` | Clinical/operational entity in System Background Jobs |
| 4 | `dbo.ErrorLogs` | Clinical/operational entity in System Background Jobs |
| 5 | `dbo.ImmediateNeeds` | Clinical/operational entity in System Background Jobs |
| 6 | `dbo.MedicalContract` | Clinical/operational entity in System Background Jobs |
| 7 | `dbo.MedicalExam` | Clinical/operational entity in System Background Jobs |
| 8 | `dbo.MedicalHistories` | Clinical/operational entity in System Background Jobs |
| 9 | `dbo.MedicalStatus` | Clinical/operational entity in System Background Jobs |
| 10 | `dbo.MedicalStatuses` | Clinical/operational entity in System Background Jobs |
| 11 | `dbo.Medical_ROS` | Clinical/operational entity in System Background Jobs |
| 12 | `dbo.Medicine` | Clinical/operational entity in System Background Jobs |
| 13 | `dbo.PsychiatricMedicines` | Clinical/operational entity in System Background Jobs |
| 14 | `dbo.RNP_ReceivingMedicalCare` | Clinical/operational entity in System Background Jobs |
| 15 | `dbo.SF_Physiology` | Clinical/operational entity in System Background Jobs |
| 16 | `dbo.SchemaVersions` | Clinical/operational entity in System Background Jobs |
| 17 | `dbo.SubstanceUseDisorderInitial` | Clinical/operational entity in System Background Jobs |
| 18 | `dbo.UpdateLogs` | Clinical/operational entity in System Background Jobs |
| 19 | `dbo.logs` | Clinical/operational entity in System Background Jobs |
| 20 | `dbo.systranschemas` | Clinical/operational entity in System Background Jobs |
| 21 | `dbo.tblAUDIT` | Clinical/operational entity in System Background Jobs |
| 22 | `dbo.tblCreditDetail` | Clinical/operational entity in System Background Jobs |
| 23 | `dbo.tblCreditHeader` | Clinical/operational entity in System Background Jobs |
| 24 | `dbo.tblDivCallLog` | Clinical/operational entity in System Background Jobs |
| 25 | `dbo.tblEDITS` | Clinical/operational entity in System Background Jobs |
| 26 | `dbo.tblLoginLog` | Clinical/operational entity in System Background Jobs |
| 27 | `dbo.tblMedicaid` | Clinical/operational entity in System Background Jobs |
| 28 | `dbo.tblPAYROEDIT` | Clinical/operational entity in System Background Jobs |
| 29 | `dbo.tblPharmLogDetail` | Clinical/operational entity in System Background Jobs |
| 30 | `dbo.tblPharmLogHead` | Clinical/operational entity in System Background Jobs |
| 31 | `dbo.tblPharmLogTransmit` | Clinical/operational entity in System Background Jobs |
| 32 | `dbo.tblServiceStatusLog` | Clinical/operational entity in System Background Jobs |
| 33 | `dbo.tblUPDATES` | Clinical/operational entity in System Background Jobs |

### 1.15 Operational Subledgers & Miscellaneous System Tables (438 tables)
*Supporting operational tables, lookup codes, legacy temporary tables, and reference mappings.*

| # | Table Name | Description / Role |
|---|---|---|
| 1 | `dbo.ATDSUTIFCOCManagedCareOrganizationsDetails` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 2 | `dbo.AdministrativeRoute` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 3 | `dbo.AdverseChildhood` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 4 | `dbo.AlternateTreatmentOptions` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 5 | `dbo.ApplicationReference` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 6 | `dbo.AssessCustom` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 7 | `dbo.AssessCustomDDL` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 8 | `dbo.AssessCustomData` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 9 | `dbo.CAPregnancy` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 10 | `dbo.CIWAB` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 11 | `dbo.COAdvancedDirectives` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 12 | `dbo.COCwithCommunityPhysicians` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 13 | `dbo.CTNeedsReportData` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 14 | `dbo.CentralRegistry` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 15 | `dbo.CentralRegistryReporting` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 16 | `dbo.CentralRegistryState` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 17 | `dbo.ChangeTrackingVersion` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 18 | `dbo.Clntmast` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 19 | `dbo.Conclusions` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 20 | `dbo.ConfigurationLookUpTable` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 21 | `dbo.Constellation` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 22 | `dbo.Contacts` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 23 | `dbo.ContinuingTreatmentPositiveUDS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 24 | `dbo.CoordinationofCare` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 25 | `dbo.CriminalJusticeROI` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 26 | `dbo.CriminalJusticeROIStandAlone` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 27 | `dbo.CrisisPrevention` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 28 | `dbo.CulturalFactors` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 29 | `dbo.CurrentPregnancy` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 30 | `dbo.CurrentReview` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 31 | `dbo.CustomReportCriterias` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 32 | `dbo.CustomReports` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 33 | `dbo.DAPIllicitSubstanceUse` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 34 | `dbo.DATES_OF_PREVIOUS_TREATMENT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 35 | `dbo.DCSupplementalMaster` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 36 | `dbo.DUIArrests` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 37 | `dbo.DatabaseVersionDetails` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 38 | `dbo.Dim_Date` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 39 | `dbo.DroDownListItems` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 40 | `dbo.DropDownLists` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 41 | `dbo.DropdownValues` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 42 | `dbo.Dropdowns` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 43 | `dbo.DrugAlcoholUses` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 44 | `dbo.DrugUsageFrequency` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 45 | `dbo.DrugsAlcoholDetail` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 46 | `dbo.DrugsList` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 47 | `dbo.DrugsUsage` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 48 | `dbo.DynamicSignature` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 49 | `dbo.Employment` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 50 | `dbo.EmploymentOrSupport` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 51 | `dbo.EmploymentSupport` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 52 | `dbo.EmploymentSupportStauses` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 53 | `dbo.ExtendedAbsense` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 54 | `dbo.FamilySocialHistories` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 55 | `dbo.FamilySocialRelation` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 56 | `dbo.FamilySocialRelationShips` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 57 | `dbo.FundingRequiredData` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 58 | `dbo.GPRA` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 59 | `dbo.GainSSVersion4` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 60 | `dbo.Grid` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 61 | `dbo.GuestDosingPermanentTransfer` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 62 | `dbo.GuestDosingPermanentTransferCurrentRxOrders` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 63 | `dbo.HCRCMAGeneral` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 64 | `dbo.HIVHepRiskReviewEducation` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 65 | `dbo.HIVTBPrevention` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 66 | `dbo.HL7TestDetail` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 67 | `dbo.HL7Tests` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 68 | `dbo.HL7_EVENTS_ADT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 69 | `dbo.HelperDateTable` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 70 | `dbo.Histories` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 71 | `dbo.HnP_Allergies` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 72 | `dbo.HnP_BCIM` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 73 | `dbo.HnP_Ethnicity` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 74 | `dbo.HoldTriggerConfig` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 75 | `dbo.HospitalizationRecord` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 76 | `dbo.HousingStatus` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 77 | `dbo.Image` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 78 | `dbo.Immunization` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 79 | `dbo.Incarceration` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 80 | `dbo.IncidentAndRiskIdenticationViewModel` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 81 | `dbo.IncidentandRiskIdentification` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 82 | `dbo.InitialCompAssesCultureBackgroundBelief` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 83 | `dbo.InitialCompAssesEducationTraining` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 84 | `dbo.InitialCompAssesFamilyOfOrigin` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 85 | `dbo.InitialCompAssesFamilyOfOriginMembers` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 86 | `dbo.InitialCompAssesLearningTreatment` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 87 | `dbo.InitialCompAssesLeisureSocial` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 88 | `dbo.InitialCompAssesMentalStatus` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 89 | `dbo.InitialCompAssesPresentingProblem` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 90 | `dbo.InitialCompAssesSNAP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 91 | `dbo.InitialCompAssesSocialService` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 92 | `dbo.InsuranceBenefitVerification` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 93 | `dbo.InterchangeHTML` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 94 | `dbo.InterpretiveSummarySNAP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 95 | `dbo.InterviewerAssesment` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 96 | `dbo.InterviewerSummary` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 97 | `dbo.KTCCASH` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 98 | `dbo.LAPharmacistCounselingElection` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 99 | `dbo.LASORCostofServices` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 100 | `dbo.LEC5` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 101 | `dbo.Legal` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 102 | `dbo.LegalStatus` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 103 | `dbo.LegalStatuses` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 104 | `dbo.LevelJustification` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 105 | `dbo.LinkedField` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 106 | `dbo.LivingEnvironment` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 107 | `dbo.MADPH` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 108 | `dbo.MATandDriving` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 109 | `dbo.MDCarelonROI` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 110 | `dbo.MIAdvancedDirective` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 111 | `dbo.MIMDHHS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 112 | `dbo.MIMDHSS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 113 | `dbo.MIOrientationChecklist` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 114 | `dbo.MNTreatmentServiceReview` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 115 | `dbo.MOOrientationChecklist` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 116 | `dbo.MandatoryTBAndSTIEducation` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 117 | `dbo.MassachusettsCentralRegistry` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 118 | `dbo.MasterBenzoRisk` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 119 | `dbo.MasterHousingStatus` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 120 | `dbo.MasterPMP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 121 | `dbo.MasterSignature` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 122 | `dbo.MedDetermination` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 123 | `dbo.Military` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 124 | `dbo.NC974708` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 125 | `dbo.NCCentralRegistryERClosureAuth` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 126 | `dbo.NCPIE` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 127 | `dbo.NCPIEUDS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 128 | `dbo.NCPersonCenteredProfile` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 129 | `dbo.NVAdmissionSupplemental` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 130 | `dbo.NVAdmissionSupplementalMaster` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 131 | `dbo.NVComprehensiveWrittenReport` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 132 | `dbo.NVPrenatalChecklist` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 133 | `dbo.NeedsReportsMaster` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 134 | `dbo.NewBenefitVerification` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 135 | `dbo.NewCASH` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 136 | `dbo.NinetyDayReview` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 137 | `dbo.NondiscriminationNoticeFinalEnglish` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 138 | `dbo.NondiscriminationNoticeFinalSpanish` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 139 | `dbo.NoticeOfPrivacyPracticesBAART` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 140 | `dbo.NoticeOfPrivacyPracticesHCRC` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 141 | `dbo.NoticeOfPrivacyPracticesMedmark` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 142 | `dbo.NoticeOfPrivacyPracticesRevised` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 143 | `dbo.NoticeofPrivacyPractice` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 144 | `dbo.NoticeofPrivacyPracticesDC` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 145 | `dbo.OBOTStabilityIndex` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 146 | `dbo.OTPRequestforCourtesyDosing` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 147 | `dbo.OptionListItems` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 148 | `dbo.OptionLists` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 149 | `dbo.OrderRelationship` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 150 | `dbo.OrderforServices` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 151 | `dbo.OrientationChecklistNew` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 152 | `dbo.OrientationVerification` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 153 | `dbo.OtherArrests` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 154 | `dbo.PPDTest` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 155 | `dbo.Paragraph` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 156 | `dbo.Paragraph_01212025` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 157 | `dbo.Practitioners` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 158 | `dbo.Pregnancy` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 159 | `dbo.PregnancyRefusalOfCare` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 160 | `dbo.PregnancyWaiver` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 161 | `dbo.PrenatalChecklistPractitioners` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 162 | `dbo.PrescriptionReport` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 163 | `dbo.PrimaryReferralSource` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 164 | `dbo.PriorSubstanceUseCriteriaGrid` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 165 | `dbo.PsychiatricStatus` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 166 | `dbo.PsychiatricStatuses` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 167 | `dbo.RIBHOLD` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 168 | `dbo.RIPHQ9` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 169 | `dbo.RNP_Abilites` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 170 | `dbo.RNP_Allergies` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 171 | `dbo.RNP_Children` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 172 | `dbo.RNP_EmergencyContact` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 173 | `dbo.RNP_FagerStromTestStandAlone` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 174 | `dbo.RNP_FamilyOfOrigin` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 175 | `dbo.RNP_Hipaa` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 176 | `dbo.RNP_Hospitalization` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 177 | `dbo.RNP_LevelDetails` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 178 | `dbo.RNP_NodsDetails` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 179 | `dbo.RNP_NuclearFamily` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 180 | `dbo.RNP_Opportunities` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 181 | `dbo.RNP_OrientationChecklist` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 182 | `dbo.RNP_PlacementCriteria` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 183 | `dbo.RNP_Preferances` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 184 | `dbo.RNP_Signature` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 185 | `dbo.RNP_StagesOfChange` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 186 | `dbo.RNP_Strengths` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 187 | `dbo.RNP_TBSignsAndSymptoms` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 188 | `dbo.ReasonForDenial` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 189 | `dbo.RecentPregnancy` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 190 | `dbo.Recommendation` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 191 | `dbo.Referral` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 192 | `dbo.ReferralsMenHandSubUseDServices` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 193 | `dbo.RelapsePriorSubstanceUse` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 194 | `dbo.ReportHeader` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 195 | `dbo.Residence` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 196 | `dbo.Resources` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 197 | `dbo.ReviewOfSystems` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 198 | `dbo.RevocationofPtElectiontoSPForSrvAgt` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 199 | `dbo.SAFETProtocolwithCSSRS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 200 | `dbo.SFTPActivityTracking` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 201 | `dbo.SFTPVOBConnectionInfo` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 202 | `dbo.SF_ApprovedNarcotic` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 203 | `dbo.SF_CardiacRiskFactors` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 204 | `dbo.SF_Ciwa` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 205 | `dbo.SF_ConcentForTB` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 206 | `dbo.SF_DSM-V Criteria` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 207 | `dbo.SF_Dropdown` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 208 | `dbo.SF_DrugAdministrationType` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 209 | `dbo.SF_DrugChoice` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 210 | `dbo.SF_EmergencyTreatment` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 211 | `dbo.SF_FactsNInstruction` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 212 | `dbo.SF_Guidline` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 213 | `dbo.SF_HIPAAConfidentiality` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 214 | `dbo.SF_HivEducation` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 215 | `dbo.SF_IVTrackRecord` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 216 | `dbo.SF_IllicitSubstance` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 217 | `dbo.SF_InfectiousBehavioralInterview` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 218 | `dbo.SF_InfectiousDisease` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 219 | `dbo.SF_NarcoticSource` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 220 | `dbo.SF_OrientationChklist` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 221 | `dbo.SF_Pains` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 222 | `dbo.SF_ReferralSource` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 223 | `dbo.SF_RightNResponsibility` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 224 | `dbo.SF_Signature` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 225 | `dbo.SF_UnderstandingOfTreatment` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 226 | `dbo.SOWS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 227 | `dbo.SacramentoDHS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 228 | `dbo.SafetyContract` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 229 | `dbo.ScxSigContainer` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 230 | `dbo.SecondaryReferralSource` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 231 | `dbo.ServiceTriggerConfig` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 232 | `dbo.Signature` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 233 | `dbo.Social` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 234 | `dbo.SocialLifeStyle` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 235 | `dbo.SpecificSubstanceMaster` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 236 | `dbo.Substance` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 237 | `dbo.SubstanceDetails` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 238 | `dbo.SubstanceUse` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 239 | `dbo.TCMOptIn` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 240 | `dbo.Table` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 241 | `dbo.TaskDependencies` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 242 | `dbo.TblSettings` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 243 | `dbo.TrackingTool` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 244 | `dbo.TransactionKEY` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 245 | `dbo.TransactionLookUpTable` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 246 | `dbo.TransactionOBR` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 247 | `dbo.TransactionOBX` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 248 | `dbo.Transactions` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 249 | `dbo.TreatmentContract` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 250 | `dbo.TreatmentEpisode` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 251 | `dbo.TreatmentServicesReview` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 252 | `dbo.Versions` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 253 | `dbo.WeCare_RelapsePriorSubstanceUse` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 254 | `dbo.WeaponsPolicy` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 255 | `dbo.category` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 256 | `dbo.ccgauths` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 257 | `dbo.dim_VALUES` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 258 | `dbo.dim_VALUES2` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 259 | `dbo.encrypt_test` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 260 | `dbo.importmatch` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 261 | `dbo.incident` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 262 | `dbo.initialperson` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 263 | `dbo.meds` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 264 | `dbo.pbiMeasures` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 265 | `dbo.servicetrigger_bak_10252024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 266 | `dbo.servicetriggerconfig_01162026` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 267 | `dbo.servicetriggerconfig_12152025` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 268 | `dbo.subcategory` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 269 | `dbo.sysdiagrams` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 270 | `dbo.tblAGE` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 271 | `dbo.tblAMSpix` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 272 | `dbo.tblAPPT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 273 | `dbo.tblASSIST` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 274 | `dbo.tblAWS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 275 | `dbo.tblAppoinmentSFInfo` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 276 | `dbo.tblArea` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 277 | `dbo.tblAuthRequestType` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 278 | `dbo.tblBACresult` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 279 | `dbo.tblBEAKER` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 280 | `dbo.tblBEAKERCOLOR` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 281 | `dbo.tblBEDSETUP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 282 | `dbo.tblBHGNoticeOfPrivacyPractices` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 283 | `dbo.tblBOTRECEPT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 284 | `dbo.tblCHSAMSpix` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 285 | `dbo.tblCLTID` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 286 | `dbo.tblCODEADVANCEMENT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 287 | `dbo.tblCityStateZipCode` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 288 | `dbo.tblCodes` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 289 | `dbo.tblDASA` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 290 | `dbo.tblDELI` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 291 | `dbo.tblDETAILS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 292 | `dbo.tblDIAG` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 293 | `dbo.tblDIVCALLCODES` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 294 | `dbo.tblDIVFREQ` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 295 | `dbo.tblDIVFREQ01162025` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 296 | `dbo.tblDIVSCHED` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 297 | `dbo.tblDIVSCHED01172025` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 298 | `dbo.tblDOCPAY` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 299 | `dbo.tblDRUG` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 300 | `dbo.tblDRUGRNP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 301 | `dbo.tblDSMIV` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 302 | `dbo.tblDUIINFO` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 303 | `dbo.tblDosingWindows` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 304 | `dbo.tblEMDEON` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 305 | `dbo.tblEODParams` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 306 | `dbo.tblEmail` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 307 | `dbo.tblFINGER` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 308 | `dbo.tblFMP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 309 | `dbo.tblGOALS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 310 | `dbo.tblGRIDTEST` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 311 | `dbo.tblGROUPLIST` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 312 | `dbo.tblGROUPLISTDETAIL` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 313 | `dbo.tblGroups` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 314 | `dbo.tblHOLD` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 315 | `dbo.tblHold_bak20260618122511` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 316 | `dbo.tblHold_bak20260715220334` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 317 | `dbo.tblHold_bak20260815220414` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 318 | `dbo.tblHold_bak20260901200024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 319 | `dbo.tblHold_bak20260915220220` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 320 | `dbo.tblHoliday` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 321 | `dbo.tblICDNine` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 322 | `dbo.tblICDTen` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 323 | `dbo.tblICDTen_04072026` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 324 | `dbo.tblIDCARD` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 325 | `dbo.tblINVASSOCIATION` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 326 | `dbo.tblINVENTORYGROUP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 327 | `dbo.tblINVENTORYGROUPPREPACK` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 328 | `dbo.tblINVENTORYPREPACK` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 329 | `dbo.tblINVTYPE` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 330 | `dbo.tblInterpretiveSummary` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 331 | `dbo.tblLINEITEM` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 332 | `dbo.tblLookup` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 333 | `dbo.tblMAARC` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 334 | `dbo.tblMEDS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 335 | `dbo.tblMEDV5` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 336 | `dbo.tblMESSAGE` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 337 | `dbo.tblMHBATCH` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 338 | `dbo.tblMapDrive` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 339 | `dbo.tblMonthlyReportRecords` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 340 | `dbo.tblOBATOverride` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 341 | `dbo.tblOPENINV` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 342 | `dbo.tblORDER` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 343 | `dbo.tblORDERREQ` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 344 | `dbo.tblOptumROI` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 345 | `dbo.tblOrderCustom` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 346 | `dbo.tblOverlappingServices` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 347 | `dbo.tblPAYPERMG` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 348 | `dbo.tblPICS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 349 | `dbo.tblPROCINFO` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 350 | `dbo.tblPROGSERV` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 351 | `dbo.tblPUMP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 352 | `dbo.tblPasses` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 353 | `dbo.tblPhysResult` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 354 | `dbo.tblPhysResultDetail` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 355 | `dbo.tblPowder` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 356 | `dbo.tblProblems` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 357 | `dbo.tblProtocolMAR` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 358 | `dbo.tblPsychiastristEvalSNAP` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 359 | `dbo.tblPumpCalibrate` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 360 | `dbo.tblQACCBYSResults` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 361 | `dbo.tblQAResults` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 362 | `dbo.tblQNAdetail` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 363 | `dbo.tblQNAhead` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 364 | `dbo.tblRULES` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 365 | `dbo.tblRUN` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 366 | `dbo.tblReferralAgencies` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 367 | `dbo.tblRelationship` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 368 | `dbo.tblResidential` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 369 | `dbo.tblReviewFrequency` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 370 | `dbo.tblSCAN` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 371 | `dbo.tblSCHEDv5` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 372 | `dbo.tblSERVCOST` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 373 | `dbo.tblSERVICES` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 374 | `dbo.tblSERVICES_Bak06052025` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 375 | `dbo.tblSERVTPLINK` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 376 | `dbo.tblSHAREPOINT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 377 | `dbo.tblSched` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 378 | `dbo.tblSpecialPops` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 379 | `dbo.tblStagesofchanges` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 380 | `dbo.tblStatusArea` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 381 | `dbo.tblTBResult` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 382 | `dbo.tblTBResultDetail` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 383 | `dbo.tblTESTINGRULES` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 384 | `dbo.tblTOXPANEL` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 385 | `dbo.tblTOXPANEL_bak10252024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 386 | `dbo.tblTP17OBJ` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 387 | `dbo.tblTP17REVIEW` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 388 | `dbo.tblTP17Snap` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 389 | `dbo.tblTPDDLitems` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 390 | `dbo.tblTPDETAIL` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 391 | `dbo.tblTPDetailObj` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 392 | `dbo.tblTPHEAD` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 393 | `dbo.tblTPHEAD_Comments` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 394 | `dbo.tblTPHEAD_Reviews` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 395 | `dbo.tblTP_DSM` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 396 | `dbo.tblTRANSMIT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 397 | `dbo.tblTREATMENTCENTER` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 398 | `dbo.tblVitals` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 399 | `dbo.tblWTC` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 400 | `dbo.tblWTC1` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 401 | `dbo.tblWTC2` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 402 | `dbo.tblWTC3` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 403 | `dbo.tblWTC4` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 404 | `dbo.tblWTC5` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 405 | `dbo.tblWTC6` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 406 | `dbo.tblWhodas2` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 407 | `dbo.tblcodes_bak_10252024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 408 | `dbo.tbld300` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 409 | `dbo.tbldiag10` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 410 | `dbo.tbldiag10_01212026` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 411 | `dbo.tbldrORDERS` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 412 | `dbo.tbldrordertype` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 413 | `dbo.tblduiChildren` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 414 | `dbo.tblduiCustody` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 415 | `dbo.tblduiDrug` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 416 | `dbo.tblduiEncounter` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 417 | `dbo.tblduiLegalStatus` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 418 | `dbo.tblduiYesNo` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 419 | `dbo.tblemdeonv5` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 420 | `dbo.tblreports` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 421 | `dbo.tblservices_bak_03172025` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 422 | `dbo.tblservices_bak_10032024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 423 | `dbo.tblservices_bak_10252024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 424 | `dbo.tblsettings_bak_01142026` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 425 | `dbo.tblsettings_bak_09022026` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 426 | `dbo.tblsettings_bak_10252024` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 427 | `dbo.tbltp17GOAL` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 428 | `dbo.tbltp17GOALREVIEW` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 429 | `dbo.tbltp17INT` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 430 | `dbo.tbltp17Status` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 431 | `dbo.tempICD` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 432 | `dbo.tempmissed` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 433 | `dbo.toximport` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 434 | `dbo.treatmentcenter` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 435 | `dbo.type` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 436 | `dbo.ut_Change_Tracking_Version` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 437 | `dbo.whitefield` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |
| 438 | `dbo.xtemp` | Clinical/operational entity in Operational Subledgers & Miscellaneous System Tables |

---

## 2. Revenue Cycle Management (`rcm` Schema - 5 Tables)

The `rcm` schema manages claims operations, medical records logs, tag assignments, and encounter actions.

| # | Table Name | Purpose in RCM Domain |
|---|---|---|
| 1 | `rcm.tblClaimTag` | Revenue cycle management workflow table |
| 2 | `rcm.tblClaimTagTpc` | Revenue cycle management workflow table |
| 3 | `rcm.TblEncounterActions` | Revenue cycle management workflow table |
| 4 | `rcm.tblMRLogs` | Revenue cycle management workflow table |
| 5 | `rcm.tblVoidRevertHx` | Revenue cycle management workflow table |

---

## 3. System & Mobile Analytics (`scx` Schema - 5 Tables)

The `scx` schema manages mobile app banners, push notifications, and form restriction rules.

| # | Table Name | Purpose |
|---|---|---|
| 1 | `scx.FormDataInfo` | Mobile banners, notification routing & form security |
| 2 | `scx.FormMapping` | Mobile banners, notification routing & form security |
| 3 | `scx.Notification` | Mobile banners, notification routing & form security |
| 4 | `scx.ScxMobileBanner` | Mobile banners, notification routing & form security |
| 5 | `scx.tblRestrictForms` | Mobile banners, notification routing & form security |

---

## 4. Change Data Capture & Audit Replication (`cdc` Schema - 23 Tables)

These tables support real-time data replication and transaction auditing for critical clinical and financial entities.

| # | Table Name | Entity Tracked |
|---|---|---|
| 1 | `cdc.captured_columns` | SQL Server Change Data Capture audit trail |
| 2 | `cdc.change_tables` | SQL Server Change Data Capture audit trail |
| 3 | `cdc.dbo_AdmissionAssessmentSummary_CT` | SQL Server Change Data Capture audit trail |
| 4 | `cdc.dbo_Appointments_CT` | SQL Server Change Data Capture audit trail |
| 5 | `cdc.dbo_PACounselorReview_CT` | SQL Server Change Data Capture audit trail |
| 6 | `cdc.dbo_SF_PatientPreAdmission_CT` | SQL Server Change Data Capture audit trail |
| 7 | `cdc.dbo_tbl3pARNOTE_CT` | SQL Server Change Data Capture audit trail |
| 8 | `cdc.dbo_tbl3pClaim_CT` | SQL Server Change Data Capture audit trail |
| 9 | `cdc.dbo_tbl3pClaimLineItem_CT` | SQL Server Change Data Capture audit trail |
| 10 | `cdc.dbo_tbl3pClaimLineItemActivity_CT` | SQL Server Change Data Capture audit trail |
| 11 | `cdc.dbo_tbl3pClaimNote_CT` | SQL Server Change Data Capture audit trail |
| 12 | `cdc.dbo_tblBill_CT` | SQL Server Change Data Capture audit trail |
| 13 | `cdc.dbo_tblclaimstatus_CT` | SQL Server Change Data Capture audit trail |
| 14 | `cdc.dbo_tblDartsSrv_CT` | SQL Server Change Data Capture audit trail |
| 15 | `cdc.dbo_tblDOSE_CT` | SQL Server Change Data Capture audit trail |
| 16 | `cdc.dbo_tblENROLL_CT` | SQL Server Change Data Capture audit trail |
| 17 | `cdc.dbo_tblLiquidLog_CT` | SQL Server Change Data Capture audit trail |
| 18 | `cdc.dbo_tblORDER_CT` | SQL Server Change Data Capture audit trail |
| 19 | `cdc.dbo_tblUAResult_CT` | SQL Server Change Data Capture audit trail |
| 20 | `cdc.dbo_tblUASched_CT` | SQL Server Change Data Capture audit trail |
| 21 | `cdc.ddl_history` | SQL Server Change Data Capture audit trail |
| 22 | `cdc.index_columns` | SQL Server Change Data Capture audit trail |
| 23 | `cdc.lsn_time_mapping` | SQL Server Change Data Capture audit trail |

---

## 5. Master Directory (All 1,906 Tables Alphabetized by Schema)

| # | Schema | Table Name |
|---|---|---|
| 1 | `cdc` | `captured_columns` |
| 2 | `cdc` | `change_tables` |
| 3 | `cdc` | `dbo_AdmissionAssessmentSummary_CT` |
| 4 | `cdc` | `dbo_Appointments_CT` |
| 5 | `cdc` | `dbo_PACounselorReview_CT` |
| 6 | `cdc` | `dbo_SF_PatientPreAdmission_CT` |
| 7 | `cdc` | `dbo_tbl3pARNOTE_CT` |
| 8 | `cdc` | `dbo_tbl3pClaim_CT` |
| 9 | `cdc` | `dbo_tbl3pClaimLineItem_CT` |
| 10 | `cdc` | `dbo_tbl3pClaimLineItemActivity_CT` |
| 11 | `cdc` | `dbo_tbl3pClaimNote_CT` |
| 12 | `cdc` | `dbo_tblBill_CT` |
| 13 | `cdc` | `dbo_tblclaimstatus_CT` |
| 14 | `cdc` | `dbo_tblDartsSrv_CT` |
| 15 | `cdc` | `dbo_tblDOSE_CT` |
| 16 | `cdc` | `dbo_tblENROLL_CT` |
| 17 | `cdc` | `dbo_tblLiquidLog_CT` |
| 18 | `cdc` | `dbo_tblORDER_CT` |
| 19 | `cdc` | `dbo_tblUAResult_CT` |
| 20 | `cdc` | `dbo_tblUASched_CT` |
| 21 | `cdc` | `ddl_history` |
| 22 | `cdc` | `index_columns` |
| 23 | `cdc` | `lsn_time_mapping` |
| 24 | `dbo` | `AbuseHistories` |
| 25 | `dbo` | `ACBHCSInformingMaterialAcknowledg` |
| 26 | `dbo` | `ACBHCSSmartCare` |
| 27 | `dbo` | `ACBHCSSmartCareClientContacts` |
| 28 | `dbo` | `ACBHCSSmartCareDemographicAndClientInfoTab` |
| 29 | `dbo` | `ACBHCSSmartCareEpisodeTab` |
| 30 | `dbo` | `ACBHCSSmartCareGeneralTab` |
| 31 | `dbo` | `ACBHCSSmartCareProgramTab` |
| 32 | `dbo` | `ACBHCSSmartCareSUD` |
| 33 | `dbo` | `ACBHCSSmartCareSUDMedicalMentalHealthTab` |
| 34 | `dbo` | `ACBHCSSUDConsent` |
| 35 | `dbo` | `ACBHCSSUDUpdateDischargeForm` |
| 36 | `dbo` | `ACBHIncidentalDisclosureCltAck` |
| 37 | `dbo` | `ACBHTobaccoUseAssessment` |
| 38 | `dbo` | `AcknowledgementReceiptMaterial` |
| 39 | `dbo` | `ActiveMedicalProblems` |
| 40 | `dbo` | `Addiction` |
| 41 | `dbo` | `AddressMaster` |
| 42 | `dbo` | `AdministrativeRoute` |
| 43 | `dbo` | `AdmissionAgreement` |
| 44 | `dbo` | `AdmissionAssessment` |
| 45 | `dbo` | `AdmissionAssessmentAllergy` |
| 46 | `dbo` | `AdmissionAssessmentDimensionFiveMentalStatusExam` |
| 47 | `dbo` | `AdmissionAssessmentDimensionFiveSubstanceUse` |
| 48 | `dbo` | `AdmissionAssessmentDimensionFour` |
| 49 | `dbo` | `AdmissionAssessmentDimensionOneDetail` |
| 50 | `dbo` | `AdmissionAssessmentDimensionOneDisorder` |
| 51 | `dbo` | `AdmissionAssessmentDimensionOneSubstanceUseHistory` |
| 52 | `dbo` | `AdmissionAssessmentDimensionSix` |
| 53 | `dbo` | `AdmissionAssessmentDimensionThree` |
| 54 | `dbo` | `AdmissionAssessmentDimensionTwo` |
| 55 | `dbo` | `AdmissionAssessmentMedication` |
| 56 | `dbo` | `AdmissionAssessmentModifiedMINIScreen` |
| 57 | `dbo` | `AdmissionAssessmentPractitioner` |
| 58 | `dbo` | `AdmissionAssessmentSubstanceUseHistory` |
| 59 | `dbo` | `AdmissionAssessmentSummary` |
| 60 | `dbo` | `AdmissionAssessmentTreatmentHistory` |
| 61 | `dbo` | `AdmissionDischargeDiagnosis` |
| 62 | `dbo` | `AdmissionPhysicalHistoryDiagnosis` |
| 63 | `dbo` | `AdmissionPhysicalHistorySubstanceUseHistory` |
| 64 | `dbo` | `AdmissionScreeningForm` |
| 65 | `dbo` | `AdmissionScreeningFormAllergy` |
| 66 | `dbo` | `AdmissionScreeningFormMHPractitioner` |
| 67 | `dbo` | `AdmissionScreeningFormOTCMedication` |
| 68 | `dbo` | `AdmissionScreeningFormPregnancy` |
| 69 | `dbo` | `AdmissionScreeningFormPrescribedMedication` |
| 70 | `dbo` | `AdmissionScreeningFormSubstanceUseHistory` |
| 71 | `dbo` | `AdmissionScreeningFormTreatmentHistory` |
| 72 | `dbo` | `AdultAsam` |
| 73 | `dbo` | `AdultAsamDimension1` |
| 74 | `dbo` | `AdultAsamDimension2` |
| 75 | `dbo` | `AdultAsamDimension3` |
| 76 | `dbo` | `AdultAsamDimension4` |
| 77 | `dbo` | `AdultAsamDimension5` |
| 78 | `dbo` | `AdultAsamDimension6` |
| 79 | `dbo` | `AdultAsamDimensionMedication` |
| 80 | `dbo` | `AdultNutritionalScreen` |
| 81 | `dbo` | `AdultSUDLevelAssessment` |
| 82 | `dbo` | `AdultSUDLevelAssessmentDimension1` |
| 83 | `dbo` | `AdultSUDLevelAssessmentDimension2` |
| 84 | `dbo` | `AdultSUDLevelAssessmentDimension3` |
| 85 | `dbo` | `AdultSUDLevelAssessmentDimension4` |
| 86 | `dbo` | `AdultSUDLevelAssessmentDimension5` |
| 87 | `dbo` | `AdultSUDLevelAssessmentDimension6` |
| 88 | `dbo` | `AdultSUDLevelAssessmentPlacementSummary` |
| 89 | `dbo` | `AdvanceDirective` |
| 90 | `dbo` | `AdverseChildhood` |
| 91 | `dbo` | `AIMSScaleComparable` |
| 92 | `dbo` | `ALASAMAdultAssessment` |
| 93 | `dbo` | `ALASAMAdultAssessmentDimension1` |
| 94 | `dbo` | `ALASAMAdultAssessmentDimension2` |
| 95 | `dbo` | `ALASAMAdultAssessmentDimension3` |
| 96 | `dbo` | `ALASAMAdultAssessmentDimension4` |
| 97 | `dbo` | `ALASAMAdultAssessmentDimension5` |
| 98 | `dbo` | `ALASAMAdultAssessmentDimension6` |
| 99 | `dbo` | `ALASAMAssessment` |
| 100 | `dbo` | `ALASAMAssessmentASAISData` |
| 101 | `dbo` | `ALASAMAssessmentAssessment` |
| 102 | `dbo` | `ALASAMAssessmentDProfile` |
| 103 | `dbo` | `ALASAMAssessmentUncopeScreening` |
| 104 | `dbo` | `AlcoholAssessment` |
| 105 | `dbo` | `AlcoholScreeningandRiskAssessmentForm` |
| 106 | `dbo` | `Allergy` |
| 107 | `dbo` | `AlternateTreatmentOptions` |
| 108 | `dbo` | `ALUncopeScreeningElectronicVersion` |
| 109 | `dbo` | `AnnualJustification` |
| 110 | `dbo` | `AnnualJustificationRevised` |
| 111 | `dbo` | `AnnualPhysicalWaiver` |
| 112 | `dbo` | `AnnualReviewofPatient` |
| 113 | `dbo` | `Answer` |
| 114 | `dbo` | `AnswerSignature` |
| 115 | `dbo` | `AntidiversionAgreement` |
| 116 | `dbo` | `ApplicationReference` |
| 117 | `dbo` | `AppointmentAttend` |
| 118 | `dbo` | `appointmentexcuse` |
| 119 | `dbo` | `AppointmentNotificationStatus` |
| 120 | `dbo` | `AppointmentQualifierMapping` |
| 121 | `dbo` | `AppointmentQueueConfiguration` |
| 122 | `dbo` | `Appointments` |
| 123 | `dbo` | `Appointments_bak20260618122228` |
| 124 | `dbo` | `Appointments_bak20260715220201` |
| 125 | `dbo` | `Appointments_bak20260815220200` |
| 126 | `dbo` | `Appointments_bak20260901200000` |
| 127 | `dbo` | `Appointments_bak20260915220200` |
| 128 | `dbo` | `ASAMAssessmentSummary` |
| 129 | `dbo` | `AsamPlacement` |
| 130 | `dbo` | `ASAMPlacementCriteriaVersionTwo` |
| 131 | `dbo` | `AsamReAssessmentReview` |
| 132 | `dbo` | `AssesmentDiagnosis` |
| 133 | `dbo` | `AssessCustom` |
| 134 | `dbo` | `AssessCustomData` |
| 135 | `dbo` | `AssessCustomDDL` |
| 136 | `dbo` | `AssessmentAllergy` |
| 137 | `dbo` | `AssessmentCurrentMedication` |
| 138 | `dbo` | `AssessmentFamilyHistory` |
| 139 | `dbo` | `AssessmentMasterProblems` |
| 140 | `dbo` | `AssessmentMedicalHistory` |
| 141 | `dbo` | `AssessmentPastMedication` |
| 142 | `dbo` | `AssessmentPastWorkHistory` |
| 143 | `dbo` | `AssessmentPractitioners` |
| 144 | `dbo` | `AssessmentPregnancyHistory` |
| 145 | `dbo` | `Assessments` |
| 146 | `dbo` | `AssessmentSNAP` |
| 147 | `dbo` | `AssessmentSubstanceUseHistory` |
| 148 | `dbo` | `AssessmentTreatmentHistory` |
| 149 | `dbo` | `ATDSUTIFCOCManagedCareOrganizationsDetails` |
| 150 | `dbo` | `AuditForm` |
| 151 | `dbo` | `AuthorizationToDiscloseSubstanceUseTIFCOC` |
| 152 | `dbo` | `BAARTVisaliaRegistrationCheck` |
| 153 | `dbo` | `BAARTVisaliaRegistrationCheckGridData` |
| 154 | `dbo` | `BAMForm` |
| 155 | `dbo` | `BAMScore` |
| 156 | `dbo` | `BenzodiazepineActionPlan` |
| 157 | `dbo` | `BenzodiazepineActionPlanRevised` |
| 158 | `dbo` | `BenzodiazepinesUseAgreement` |
| 159 | `dbo` | `BenzodiazepineUsePatientEducationandAcknowledgment` |
| 160 | `dbo` | `BHRDAcknowledgement` |
| 161 | `dbo` | `BHSCareQualityOptOut` |
| 162 | `dbo` | `BHSConsentforServices` |
| 163 | `dbo` | `BillingAssignmentOfBenefits` |
| 164 | `dbo` | `BillingAssignmentOfBenefitsAddress` |
| 165 | `dbo` | `BillingAssignmentOfBenefitsPrivateProviderDetails` |
| 166 | `dbo` | `BillTypeMaster` |
| 167 | `dbo` | `bkup_tblClientSFID` |
| 168 | `dbo` | `BriefTraumaQuestionnaire` |
| 169 | `dbo` | `CAConsentToDisclose` |
| 170 | `dbo` | `CAConsentToDiscloseClinicAddress` |
| 171 | `dbo` | `CalOMSAdministrativeDischarge` |
| 172 | `dbo` | `CalOMSAdmission` |
| 173 | `dbo` | `CalomsAnnual` |
| 174 | `dbo` | `CalOMSDischarge` |
| 175 | `dbo` | `CalOMSDischargeNew` |
| 176 | `dbo` | `CalomsDischargeQuestionnaire` |
| 177 | `dbo` | `CAMultipleRegistration` |
| 178 | `dbo` | `CAMultipleRegistrationProgram` |
| 179 | `dbo` | `CAPatientBillOfRights` |
| 180 | `dbo` | `CAPatientRightsandResponsibilitiesAddress` |
| 181 | `dbo` | `CAPregnancy` |
| 182 | `dbo` | `CAPregnancyAcknowledgment` |
| 183 | `dbo` | `CaseIntervention` |
| 184 | `dbo` | `CaseProgress` |
| 185 | `dbo` | `CaseVisitNote` |
| 186 | `dbo` | `category` |
| 187 | `dbo` | `ccgauths` |
| 188 | `dbo` | `CedarRecoveryCostofServicesAgreement` |
| 189 | `dbo` | `CentralRegistry` |
| 190 | `dbo` | `CentralRegistryClient` |
| 191 | `dbo` | `CentralRegistryClient_20241106004807` |
| 192 | `dbo` | `CentralRegistryReporting` |
| 193 | `dbo` | `CentralRegistryState` |
| 194 | `dbo` | `ChangeTrackingVersion` |
| 195 | `dbo` | `CheckInMessageConfig` |
| 196 | `dbo` | `ChronicMedicine` |
| 197 | `dbo` | `CITY CLIENTS from old db` |
| 198 | `dbo` | `CIWAB` |
| 199 | `dbo` | `claim_information` |
| 200 | `dbo` | `ClientCommunicationLog` |
| 201 | `dbo` | `ClientDischarge` |
| 202 | `dbo` | `ClientEducation` |
| 203 | `dbo` | `ClientFormMaster` |
| 204 | `dbo` | `ClientKardiaMapping` |
| 205 | `dbo` | `ClientMaster` |
| 206 | `dbo` | `ClientRegistration` |
| 207 | `dbo` | `ClientTransgender` |
| 208 | `dbo` | `CLINIC59_COUNSNOTES` |
| 209 | `dbo` | `CLINIC59_INSURANCE` |
| 210 | `dbo` | `CLINIC59_NOTES` |
| 211 | `dbo` | `CLINIC59_PATIENTMEDS` |
| 212 | `dbo` | `Clntmast` |
| 213 | `dbo` | `COAdvancedDirectives` |
| 214 | `dbo` | `COCMedicationDetail` |
| 215 | `dbo` | `COCwithCommunityPhysicians` |
| 216 | `dbo` | `CompositeScores` |
| 217 | `dbo` | `ComprehensiveAssessmentForm` |
| 218 | `dbo` | `ComprehensiveAssessmentSubstanceUseHistory` |
| 219 | `dbo` | `ComprehensiveAssessmentUpdate` |
| 220 | `dbo` | `Conclusions` |
| 221 | `dbo` | `ConditionalLicenseNotificationCurrent` |
| 222 | `dbo` | `ConditionalLicenseNotificationProspective` |
| 223 | `dbo` | `ConfidentialInformationDualEnrollment` |
| 224 | `dbo` | `ConfidentialityofAlcoholandDrugAbuse` |
| 225 | `dbo` | `ConfigurationLookUpTable` |
| 226 | `dbo` | `ConsentAcknowledgementTelehealth` |
| 227 | `dbo` | `ConsentAndAuthorizationforDisclosureofSUD` |
| 228 | `dbo` | `ConsentandScreenFTST` |
| 229 | `dbo` | `ConsentCentralRegistryAlabama` |
| 230 | `dbo` | `ConsentCentralRegistryColorado` |
| 231 | `dbo` | `ConsentCentralRegistryLouisiana` |
| 232 | `dbo` | `ConsentExpiresDetails` |
| 233 | `dbo` | `ConsentforCommunication` |
| 234 | `dbo` | `ConsentForCounseling` |
| 235 | `dbo` | `ConsentforDualEnrollment` |
| 236 | `dbo` | `ConsentforDualEnrollmentFaxNo` |
| 237 | `dbo` | `ConsentForFollowUpContact` |
| 238 | `dbo` | `ConsentforReleaseConInfoHosp` |
| 239 | `dbo` | `ConsentforReleaseConInfoHospClinicRecords` |
| 240 | `dbo` | `ConsentforReleaseConInfoRevised` |
| 241 | `dbo` | `ConsentForReleaseOfConfidentialInfo` |
| 242 | `dbo` | `ConsentParticipationCentralRegistry` |
| 243 | `dbo` | `ConsentReleaseEmergencyContact` |
| 244 | `dbo` | `ConsentReleaseEmergencyContact_Bak` |
| 245 | `dbo` | `ConsentReleasePrescriptionInformation` |
| 246 | `dbo` | `ConsentToDiscloseAssignmentofBenefits` |
| 247 | `dbo` | `ConsentToDiscloseInfoMultipleRegistrationIL` |
| 248 | `dbo` | `ConsentToDiscloseInfoMultipleRegistrationNM` |
| 249 | `dbo` | `ConsentToDisclosureofPatientInfo` |
| 250 | `dbo` | `ConsenttoDisclosureofPatientInformation` |
| 251 | `dbo` | `ConsenttoDisclosurePatientInformationProgram` |
| 252 | `dbo` | `ConsenttoDisclosurePatientInformationProgramAddress` |
| 253 | `dbo` | `ConsentToDisInfoMultipleRegiMaint` |
| 254 | `dbo` | `ConsenttoMarketing` |
| 255 | `dbo` | `ConsentToMessachusettsCentralRegistry` |
| 256 | `dbo` | `ConsenttoParticipateinCentralRegistry` |
| 257 | `dbo` | `ConsentToParticipateInTelecounselingV1` |
| 258 | `dbo` | `ConsenttoparticipateinTelecounselingV1New` |
| 259 | `dbo` | `ConsentToPreventMultipleEnrollments` |
| 260 | `dbo` | `ConsenttoReceiveCommunication` |
| 261 | `dbo` | `ConsenttoReleaseInformationtotheHealthDepartmentRevised` |
| 262 | `dbo` | `ConsentToReleaseToMedicalAssistance` |
| 263 | `dbo` | `ConsenttoTransferBetweenOTPandOBOT` |
| 264 | `dbo` | `ConsentToTreatment` |
| 265 | `dbo` | `ConsenttoTreatmentforIOPOrEOPOrOP` |
| 266 | `dbo` | `ConsenttoTreatmentViaTelehealth` |
| 267 | `dbo` | `ConsentToTreatmentWithAnApprovedNarcotic` |
| 268 | `dbo` | `ConsentToTreatmentWithAnApprovedNarcotic_bak03292026` |
| 269 | `dbo` | `Constellation` |
| 270 | `dbo` | `Contacts` |
| 271 | `dbo` | `ContinuingTreatmentPositiveUDS` |
| 272 | `dbo` | `CoordinationofCare` |
| 273 | `dbo` | `CountyOfLossAngelesPublicHealthSAPCList` |
| 274 | `dbo` | `CriminalJusticeROI` |
| 275 | `dbo` | `CriminalJusticeROIStandAlone` |
| 276 | `dbo` | `CrisisPrevention` |
| 277 | `dbo` | `CTDemoGraphic` |
| 278 | `dbo` | `CTNeedsReportData` |
| 279 | `dbo` | `CulturalFactors` |
| 280 | `dbo` | `CurrentPregnancy` |
| 281 | `dbo` | `CurrentReview` |
| 282 | `dbo` | `CustomReportCriterias` |
| 283 | `dbo` | `CustomReports` |
| 284 | `dbo` | `DAPAssessment` |
| 285 | `dbo` | `DAPIllicitSubstanceUse` |
| 286 | `dbo` | `DAPIntervention` |
| 287 | `dbo` | `DAPPatientDetail` |
| 288 | `dbo` | `DAPPlan` |
| 289 | `dbo` | `DAPUAResult` |
| 290 | `dbo` | `DatabaseVersionDetails` |
| 291 | `dbo` | `DATES_OF_PREVIOUS_TREATMENT` |
| 292 | `dbo` | `DCSupplementalForm` |
| 293 | `dbo` | `DCSupplementalMaster` |
| 294 | `dbo` | `DeletedForms` |
| 295 | `dbo` | `Demographics` |
| 296 | `dbo` | `Demography` |
| 297 | `dbo` | `Diagnosis` |
| 298 | `dbo` | `DiagnosticCriteriaGrid` |
| 299 | `dbo` | `Dim_Date` |
| 300 | `dbo` | `dim_VALUES` |
| 301 | `dbo` | `dim_VALUES2` |
| 302 | `dbo` | `Dimension1` |
| 303 | `dbo` | `Dimension2` |
| 304 | `dbo` | `Dimension3` |
| 305 | `dbo` | `Dimension4` |
| 306 | `dbo` | `Dimension5` |
| 307 | `dbo` | `Dimension6` |
| 308 | `dbo` | `Dimensions` |
| 309 | `dbo` | `DischargeFormDiagnosis` |
| 310 | `dbo` | `DischargeServicesCriteriaTable` |
| 311 | `dbo` | `DischargeSubstanceHistory` |
| 312 | `dbo` | `DischargeSubstanceUseHistory` |
| 313 | `dbo` | `DischargeSummary` |
| 314 | `dbo` | `DischargeSummaryFormDiagnosis` |
| 315 | `dbo` | `DischargeSummarySubstanceUseHistory` |
| 316 | `dbo` | `DischargeSummaryTreatmentHistory` |
| 317 | `dbo` | `DischargeTransferPlanForm` |
| 318 | `dbo` | `DisenrollmentAssessment` |
| 319 | `dbo` | `DiversionControlNotificationofChange` |
| 320 | `dbo` | `DoseReviewForm` |
| 321 | `dbo` | `DPHconsentfortreatment` |
| 322 | `dbo` | `DraftDAPNote` |
| 323 | `dbo` | `DroDownListItems` |
| 324 | `dbo` | `DropDownListFamilySupportPlan` |
| 325 | `dbo` | `DropDownLists` |
| 326 | `dbo` | `Dropdowns` |
| 327 | `dbo` | `DropdownValues` |
| 328 | `dbo` | `DrugAlcoholUses` |
| 329 | `dbo` | `DrugsAlcoholDetail` |
| 330 | `dbo` | `DrugsList` |
| 331 | `dbo` | `DrugsUsage` |
| 332 | `dbo` | `DrugUsageFrequency` |
| 333 | `dbo` | `DSMIVDiagnosis` |
| 334 | `dbo` | `DTPFormClinicalSummaryReferral` |
| 335 | `dbo` | `DTPFormCurrentPrescribedMedication` |
| 336 | `dbo` | `DTPFormDiagnosis` |
| 337 | `dbo` | `DTPFormProblem` |
| 338 | `dbo` | `DTPFormReferral` |
| 339 | `dbo` | `DTPFormRxOrder` |
| 340 | `dbo` | `DTPFormServices` |
| 341 | `dbo` | `DTPFormSocioEconomicConditions` |
| 342 | `dbo` | `DTPFormSubstanceUseHistory` |
| 343 | `dbo` | `DTPFormTreatmentEpisodeSummary` |
| 344 | `dbo` | `DualEnrollmentAddress` |
| 345 | `dbo` | `DualEnrollmentCheckVanNess` |
| 346 | `dbo` | `DualEnrollmentclinic` |
| 347 | `dbo` | `DualEnrollmentSAACSHayward` |
| 348 | `dbo` | `DualEnrollmentSAACSStockton` |
| 349 | `dbo` | `DUIArrests` |
| 350 | `dbo` | `DynamicAnswer` |
| 351 | `dbo` | `DynamicControls` |
| 352 | `dbo` | `DynamicForms` |
| 353 | `dbo` | `DynamicIntakeForm` |
| 354 | `dbo` | `DynamicQuestion` |
| 355 | `dbo` | `DynamicSignature` |
| 356 | `dbo` | `EandMCodeList` |
| 357 | `dbo` | `eandMcodelist_bak_03172025` |
| 358 | `dbo` | `eandMcodelist_bak_10032024` |
| 359 | `dbo` | `EanDMcodelist_bak_10252024` |
| 360 | `dbo` | `EandMCodeRule` |
| 361 | `dbo` | `eandMcoderule_bak_03172025` |
| 362 | `dbo` | `eandMcoderule_bak_10032024` |
| 363 | `dbo` | `eanDMcoderule_bak_10252024` |
| 364 | `dbo` | `EandMCPTCode` |
| 365 | `dbo` | `eandMcPtcode_bak_03172025` |
| 366 | `dbo` | `eandMCPTCode_bak_10032024` |
| 367 | `dbo` | `eanDMCPTcode_bak_10252024` |
| 368 | `dbo` | `EandMForm` |
| 369 | `dbo` | `EandMFormAllergies` |
| 370 | `dbo` | `EandMFormAnnualJustification` |
| 371 | `dbo` | `EandMFormAssessmentPlanRecommendation` |
| 372 | `dbo` | `EandMFormConfiguration` |
| 373 | `dbo` | `eandMformconfiguration_bak_03172025` |
| 374 | `dbo` | `eandMformConfiguration_bak_10032024` |
| 375 | `dbo` | `eandMformconfiguration_bak_10252024` |
| 376 | `dbo` | `EandMFormCurrentMedicalHistory` |
| 377 | `dbo` | `EandMFormCurrentPrescribedMedication` |
| 378 | `dbo` | `EandMFormCurrentRxOrder` |
| 379 | `dbo` | `EandMFormDiagnosis` |
| 380 | `dbo` | `EandMFormDocumentation` |
| 381 | `dbo` | `EandMFormDoseReview` |
| 382 | `dbo` | `EandMFormFamilyHistories` |
| 383 | `dbo` | `EandMFormFamilyHistory` |
| 384 | `dbo` | `EandMFormIntervalHistory` |
| 385 | `dbo` | `EandMFormMDM` |
| 386 | `dbo` | `EandMFormMedAllergies` |
| 387 | `dbo` | `EandMFormMedicalHistory` |
| 388 | `dbo` | `EandMFormMedicalProviderDocumentation` |
| 389 | `dbo` | `EandMFormObotStabilty` |
| 390 | `dbo` | `EandMFormPastMedicalHistory` |
| 391 | `dbo` | `EandMFormPastPrescribedMedication` |
| 392 | `dbo` | `EandMFormPhysicalExam` |
| 393 | `dbo` | `EandMFormPMP` |
| 394 | `dbo` | `EandMFormPregnancy` |
| 395 | `dbo` | `EandMFormPregnancyHistory` |
| 396 | `dbo` | `EandMFormPregnancyResult` |
| 397 | `dbo` | `EandMFormPriorSubstanceUseTreatment` |
| 398 | `dbo` | `EandMFormReview` |
| 399 | `dbo` | `EandMFormReviewOfSystem` |
| 400 | `dbo` | `EandMFormSochxhpi` |
| 401 | `dbo` | `EandMFormSocialHistory` |
| 402 | `dbo` | `EandMFormSows` |
| 403 | `dbo` | `EandMFormSubstanceUse` |
| 404 | `dbo` | `EandMFormSubstanceUseHistory` |
| 405 | `dbo` | `EandMFormTelehealth` |
| 406 | `dbo` | `EandMFormUALabResult` |
| 407 | `dbo` | `EandMFormVital` |
| 408 | `dbo` | `EandMPriorSubstanceUseTreatmentHistory` |
| 409 | `dbo` | `EandMServiceConfig` |
| 410 | `dbo` | `EDCODSReceiptEnglish` |
| 411 | `dbo` | `EDCODSReceiptSpanish` |
| 412 | `dbo` | `EducationPrescribedMedication` |
| 413 | `dbo` | `EducationPrescribedMedicationStandAlone` |
| 414 | `dbo` | `EKGReferralFormDiagnosis` |
| 415 | `dbo` | `ElDoradoASAM` |
| 416 | `dbo` | `EmergencyMedicalInformation` |
| 417 | `dbo` | `Employment` |
| 418 | `dbo` | `EmploymentHistory` |
| 419 | `dbo` | `EmploymentHistoryFinancialApplication` |
| 420 | `dbo` | `EmploymentHistoryReAssessment` |
| 421 | `dbo` | `EmploymentOrSupport` |
| 422 | `dbo` | `EmploymentSupport` |
| 423 | `dbo` | `EmploymentSupportStauses` |
| 424 | `dbo` | `encrypt_test` |
| 425 | `dbo` | `EnrollmentAssessment ` |
| 426 | `dbo` | `ErrorLogs` |
| 427 | `dbo` | `eRx_PatientPreferredPharmacy` |
| 428 | `dbo` | `eRx_Prescriber_PlaceOfService` |
| 429 | `dbo` | `eRx_Prescription` |
| 430 | `dbo` | `eRx_PrescriptionMedication` |
| 431 | `dbo` | `eRx_Weno_PrescriptionMessage` |
| 432 | `dbo` | `ETS_SubstanceHistory` |
| 433 | `dbo` | `ETSAssessmentPrescriptionMedications` |
| 434 | `dbo` | `EvaluationAndManagement` |
| 435 | `dbo` | `EvaluationAndManagement_Diagnosis` |
| 436 | `dbo` | `EvaluationAndManagement_IntakeHistoryPrescription` |
| 437 | `dbo` | `EvaluationAndManagement_PastMedication` |
| 438 | `dbo` | `EvaluationAndManagement_ReceivingMedicalCare` |
| 439 | `dbo` | `EvaluationAndManagement_SubstanceHistory` |
| 440 | `dbo` | `ExtendedAbsenceAssessment` |
| 441 | `dbo` | `ExtendedAbsense` |
| 442 | `dbo` | `FamilyandrecoveryenvironmentAssessment` |
| 443 | `dbo` | `FamilyHistory` |
| 444 | `dbo` | `FamilySocialHistories` |
| 445 | `dbo` | `FamilySocialRelation` |
| 446 | `dbo` | `FamilySocialRelationShips` |
| 447 | `dbo` | `FamilySupportPlan` |
| 448 | `dbo` | `FamilySupportPlanProviders` |
| 449 | `dbo` | `Financial_Info` |
| 450 | `dbo` | `FinancialagreementNHV3` |
| 451 | `dbo` | `FinancialagreementV3` |
| 452 | `dbo` | `FinancialHardshipApplication` |
| 453 | `dbo` | `firstassessments` |
| 454 | `dbo` | `FlexcareScreen` |
| 455 | `dbo` | `Form` |
| 456 | `dbo` | `FormCompletion` |
| 457 | `dbo` | `FormData` |
| 458 | `dbo` | `FormRevocation` |
| 459 | `dbo` | `FormSetting` |
| 460 | `dbo` | `formsetting_bak_01142026` |
| 461 | `dbo` | `formsetting_bak_03172025` |
| 462 | `dbo` | `formsetting_bak_09022026` |
| 463 | `dbo` | `FormSetting_bak_10252024` |
| 464 | `dbo` | `FormTemplate` |
| 465 | `dbo` | `FormTemplate_01162026` |
| 466 | `dbo` | `FormTemplate_12152025` |
| 467 | `dbo` | `FresnoCountyMedical` |
| 468 | `dbo` | `FresnoCountyYouthSUD` |
| 469 | `dbo` | `FresnoDualEnrollmentclinic` |
| 470 | `dbo` | `FresnoSUDAssessment` |
| 471 | `dbo` | `FresnoSUDAssessmentD1` |
| 472 | `dbo` | `FresnoSUDAssessmentD2` |
| 473 | `dbo` | `FresnoSUDAssessmentD3` |
| 474 | `dbo` | `FresnoSUDAssessmentD4` |
| 475 | `dbo` | `FresnoSUDAssessmentD5` |
| 476 | `dbo` | `FresnoSUDAssessmentD6` |
| 477 | `dbo` | `FresnoSUDAssessmentLOCSummary` |
| 478 | `dbo` | `FresnoSUDAssessmentPSummary` |
| 479 | `dbo` | `FresnoSUDAssessmentSUH` |
| 480 | `dbo` | `FresnoSUDUpdatedAssessment` |
| 481 | `dbo` | `FresnoSUDUpdatedAssessmentD1` |
| 482 | `dbo` | `FresnoSUDUpdatedAssessmentD2` |
| 483 | `dbo` | `FresnoSUDUpdatedAssessmentD3` |
| 484 | `dbo` | `FresnoSUDUpdatedAssessmentD4` |
| 485 | `dbo` | `FresnoSUDUpdatedAssessmentD5` |
| 486 | `dbo` | `FresnoSUDUpdatedAssessmentD6` |
| 487 | `dbo` | `FresnoSUDUpdatedAssessmentLOCSummary` |
| 488 | `dbo` | `FresnoSUDUpdatedAssessmentPSummary` |
| 489 | `dbo` | `FresnoSUDUpdatedAssessmentSUH` |
| 490 | `dbo` | `FsnoDualEnrollment` |
| 491 | `dbo` | `FullAsamAssesmentDiagnosisCriteria` |
| 492 | `dbo` | `FullAsamAssesmentDimension1` |
| 493 | `dbo` | `FullAsamAssesmentDimension2` |
| 494 | `dbo` | `FullAsamAssesmentDimension3` |
| 495 | `dbo` | `FullAsamAssesmentDimension4` |
| 496 | `dbo` | `FullAsamAssesmentDimension5` |
| 497 | `dbo` | `FullAsamAssesmentDimension6` |
| 498 | `dbo` | `FullAsamAssesmentLocTool` |
| 499 | `dbo` | `FullAsamAssessment` |
| 500 | `dbo` | `FullAsamAssessmentCurrentMedication` |
| 501 | `dbo` | `FullAsamAssessmentOtherProviders` |
| 502 | `dbo` | `FullASAMAssessmentPlacementsummary` |
| 503 | `dbo` | `FullAsamAssessmentSubstanceUseHistory` |
| 504 | `dbo` | `FullAsamAssessmentTreatmentHistory` |
| 505 | `dbo` | `FundingRequiredData` |
| 506 | `dbo` | `GAConsentCentralRegistryGeorgia` |
| 507 | `dbo` | `GAConsenttoTreatmentwithanApprovedNarcotic` |
| 508 | `dbo` | `GAFemalePatientOfChildBearingAge` |
| 509 | `dbo` | `GAInformedConsent` |
| 510 | `dbo` | `GainSSVersion4` |
| 511 | `dbo` | `GeneralConsent` |
| 512 | `dbo` | `GeneralConsentAuthforReleaseInfo` |
| 513 | `dbo` | `GeneralInformation` |
| 514 | `dbo` | `GeneralInformations` |
| 515 | `dbo` | `GetAllClinicNamesForBenzodiazepineUseForm` |
| 516 | `dbo` | `GPRA` |
| 517 | `dbo` | `GPRADiagnosis` |
| 518 | `dbo` | `Grid` |
| 519 | `dbo` | `Groupnote` |
| 520 | `dbo` | `GroupNoteSession` |
| 521 | `dbo` | `GuestDosingPermanentTransfer` |
| 522 | `dbo` | `GuestDosingPermanentTransferCurrentRxOrders` |
| 523 | `dbo` | `HaywardCRIforDualEnrlCheckAddress` |
| 524 | `dbo` | `HCRCMAGeneral` |
| 525 | `dbo` | `HealthCareResourceCenterEnglish` |
| 526 | `dbo` | `HealthCareResourceCenterSpanish` |
| 527 | `dbo` | `HealthQuestionareAllergy` |
| 528 | `dbo` | `HealthQuestionareFamilyHistory` |
| 529 | `dbo` | `HealthQuestionareImmunization` |
| 530 | `dbo` | `HealthQuestionareMedication` |
| 531 | `dbo` | `HealthQuestionareVital` |
| 532 | `dbo` | `HealthQuestionnaire` |
| 533 | `dbo` | `HealthQuestionnaireCardiacRisk` |
| 534 | `dbo` | `HealthQuestionnaireFamilyHistoryGrid` |
| 535 | `dbo` | `HealthQuestionnaireGeneral` |
| 536 | `dbo` | `HealthQuestionnaireIllnessHistory` |
| 537 | `dbo` | `HealthQuestionnaireInstruction` |
| 538 | `dbo` | `HealthQuestionnaireMentalStatus` |
| 539 | `dbo` | `HealthQuestionnairePainAssessment` |
| 540 | `dbo` | `HealthQuestionnairePastHistory` |
| 541 | `dbo` | `HealthQuestionnairePregnancy` |
| 542 | `dbo` | `HealthQuestionnaireTreatmentHistory` |
| 543 | `dbo` | `HelperDateTable` |
| 544 | `dbo` | `Histories` |
| 545 | `dbo` | `HIVHepRiskReviewEducation` |
| 546 | `dbo` | `HIVTBPrevention` |
| 547 | `dbo` | `HL7_EVENTS_ADT` |
| 548 | `dbo` | `HL7ADTInformation` |
| 549 | `dbo` | `HL7Lab Information` |
| 550 | `dbo` | `HL7LabAcctNoPerSite` |
| 551 | `dbo` | `HL7LabInsuranceMap` |
| 552 | `dbo` | `HL7LabTestTypes` |
| 553 | `dbo` | `HL7TestDetail` |
| 554 | `dbo` | `HL7Tests` |
| 555 | `dbo` | `HL7TestTypesPerSiteLab` |
| 556 | `dbo` | `HnP_Allergies` |
| 557 | `dbo` | `HnP_BCIM` |
| 558 | `dbo` | `HnP_Ethnicity` |
| 559 | `dbo` | `HnP_TBMedications` |
| 560 | `dbo` | `HoldTriggerConfig` |
| 561 | `dbo` | `HospitalizationRecord` |
| 562 | `dbo` | `HousingStatus` |
| 563 | `dbo` | `IDDFormDiagnosis` |
| 564 | `dbo` | `ILConsentToDiscloseInfoMultipleRegistration` |
| 565 | `dbo` | `ILHIVForm` |
| 566 | `dbo` | `ILMultipleRegistrationProgram` |
| 567 | `dbo` | `Image` |
| 568 | `dbo` | `ImmediateNeeds` |
| 569 | `dbo` | `Immunization` |
| 570 | `dbo` | `ImpairmentAssessmentTool` |
| 571 | `dbo` | `importmatch` |
| 572 | `dbo` | `Incarceration` |
| 573 | `dbo` | `IncarcerationHistory` |
| 574 | `dbo` | `incident` |
| 575 | `dbo` | `IncidentAndRiskIdenticationViewModel` |
| 576 | `dbo` | `IncidentandRiskIdentification` |
| 577 | `dbo` | `INClinicalMedicalReview` |
| 578 | `dbo` | `IndividualGroup` |
| 579 | `dbo` | `InfectiousDiseaseAndBehavioralScreen` |
| 580 | `dbo` | `InformationaboutMAT` |
| 581 | `dbo` | `InformationSheetorFaceSheet` |
| 582 | `dbo` | `INInitialAssessment` |
| 583 | `dbo` | `InitialAssessment` |
| 584 | `dbo` | `InitialCompAssesBehavioralHealthHistory` |
| 585 | `dbo` | `InitialCompAssesBehavioralHelthPsychiatricHistory` |
| 586 | `dbo` | `InitialCompAssesChildreninformation` |
| 587 | `dbo` | `InitialCompAssesClinicalInterpretiveSummary` |
| 588 | `dbo` | `InitialCompAssesCultureBackgroundBelief` |
| 589 | `dbo` | `InitialCompAssesCurrentLivingSituation` |
| 590 | `dbo` | `InitialCompAssesEducationTraining` |
| 591 | `dbo` | `InitialCompAssesFamilyOfOrigin` |
| 592 | `dbo` | `InitialCompAssesFamilyOfOriginMembers` |
| 593 | `dbo` | `InitialCompAssesLearningTreatment` |
| 594 | `dbo` | `InitialCompAssesLegalHistory` |
| 595 | `dbo` | `InitialCompAssesLegalHistoryCharges` |
| 596 | `dbo` | `InitialCompAssesLeisureSocial` |
| 597 | `dbo` | `InitialCompAssesMaritalHistory` |
| 598 | `dbo` | `InitialCompAssesMedicalBehavioralHistory` |
| 599 | `dbo` | `InitialCompAssesMedicalBehavioralHistoryCurrentMedicalCondition` |
| 600 | `dbo` | `InitialCompAssesMedicalBehavioralHistoryCurrentMedications` |
| 601 | `dbo` | `InitialCompAssesMedicalBehavioralHistoryPastMedicalCondition` |
| 602 | `dbo` | `InitialCompAssesMedicalBehavioralHistoryPastMedications` |
| 603 | `dbo` | `InitialCompAssesMentalStatus` |
| 604 | `dbo` | `InitialCompAssesMilitryHistory` |
| 605 | `dbo` | `InitialCompAssesOccupationalHistory` |
| 606 | `dbo` | `InitialCompAssesOccupationalWorkHistory` |
| 607 | `dbo` | `InitialCompAssesPresentingProblem` |
| 608 | `dbo` | `InitialCompAssesSeriesOfQuestions` |
| 609 | `dbo` | `InitialCompAssesSexuality` |
| 610 | `dbo` | `InitialCompAssesSNAP` |
| 611 | `dbo` | `InitialCompAssesSocialService` |
| 612 | `dbo` | `InitialCompAssesSpiritually` |
| 613 | `dbo` | `InitialCompAssesSubstanceAbuse` |
| 614 | `dbo` | `InitialCompAssesTraumaHistory` |
| 615 | `dbo` | `InitialComprehensiveAssessment` |
| 616 | `dbo` | `InitialDiagnosisDetermination` |
| 617 | `dbo` | `initialperson` |
| 618 | `dbo` | `InitialServicesPlanandVAD` |
| 619 | `dbo` | `InitialTreatmentPlan` |
| 620 | `dbo` | `InitialTreatmentPlanSNAP` |
| 621 | `dbo` | `INPatientCompliance` |
| 622 | `dbo` | `INPositiveDrugScreenReview` |
| 623 | `dbo` | `InsuranceBenefitVerification` |
| 624 | `dbo` | `InsuranceFinancialApplication` |
| 625 | `dbo` | `IntakeFormService` |
| 626 | `dbo` | `IntakeFormService_bk03192025` |
| 627 | `dbo` | `IntakeFormsMenu` |
| 628 | `dbo` | `intakeformsmenu_01162026` |
| 629 | `dbo` | `intakeformsmenu_12152025` |
| 630 | `dbo` | `intakeformsmenu_bak_01142026` |
| 631 | `dbo` | `intakeformsmenu_bak_03172025` |
| 632 | `dbo` | `intakeformsmenu_bak_09022026` |
| 633 | `dbo` | `intakeformsmenu_bak_10252024` |
| 634 | `dbo` | `IntakeFormsMenu_bak01172023` |
| 635 | `dbo` | `IntakeFormsMenu_bak06142026` |
| 636 | `dbo` | `IntakeFormsNotes` |
| 637 | `dbo` | `IntakeFormStandard` |
| 638 | `dbo` | `IntakePacketTypes` |
| 639 | `dbo` | `intakepackettypes_bak_10252024` |
| 640 | `dbo` | `InterchangeHTML` |
| 641 | `dbo` | `InterpretiveSummarySNAP` |
| 642 | `dbo` | `InterviewerAssesment` |
| 643 | `dbo` | `InterviewerSummary` |
| 644 | `dbo` | `KentuckyMedicalRecordsRelease` |
| 645 | `dbo` | `KSPatientRightsResponsibilities` |
| 646 | `dbo` | `KTCCASH` |
| 647 | `dbo` | `KYAftercarePlan` |
| 648 | `dbo` | `KYCaseManageProgressNote` |
| 649 | `dbo` | `KYConsentPhotographSurveillance` |
| 650 | `dbo` | `KYConsentToDiscloseSUDMedicaid` |
| 651 | `dbo` | `KYMedicaidMemberRightsResponsibilities` |
| 652 | `dbo` | `KYMedicaidNonCoveredServicesConsent` |
| 653 | `dbo` | `KYPatientRightsandResp` |
| 654 | `dbo` | `KYPatientRightsandRespoGrievanceAddress` |
| 655 | `dbo` | `KYPDMPPatientConsentForm` |
| 656 | `dbo` | `KYTCMITPCurrentRxOrders` |
| 657 | `dbo` | `KYTCMTreatmentPlanReview` |
| 658 | `dbo` | `Laboratories` |
| 659 | `dbo` | `LaboratoryTestingWaiver` |
| 660 | `dbo` | `LabReleaseConsentVermont` |
| 661 | `dbo` | `LabReleaseConsentVT` |
| 662 | `dbo` | `labsmay` |
| 663 | `dbo` | `LAPatientHandbookandOrientation` |
| 664 | `dbo` | `LAPatientHandbookandOrientationCountyPlan` |
| 665 | `dbo` | `LAPharmacistCounselingElection` |
| 666 | `dbo` | `LASORCostofServices` |
| 667 | `dbo` | `LEC5` |
| 668 | `dbo` | `Legal` |
| 669 | `dbo` | `LegalHistory` |
| 670 | `dbo` | `LegalStatus` |
| 671 | `dbo` | `LegalStatuses` |
| 672 | `dbo` | `LevelJustification` |
| 673 | `dbo` | `LinkedField` |
| 674 | `dbo` | `LivingEnvironment` |
| 675 | `dbo` | `LivingSituation` |
| 676 | `dbo` | `LOCPAForm` |
| 677 | `dbo` | `LOCPAFormCommon` |
| 678 | `dbo` | `LOCPAFormDimension1` |
| 679 | `dbo` | `LOCPAFormDimension2` |
| 680 | `dbo` | `LOCPAFormDimension3` |
| 681 | `dbo` | `LOCPAFormDimension4` |
| 682 | `dbo` | `LOCPAFormDimension5` |
| 683 | `dbo` | `LOCPAFormDimension6` |
| 684 | `dbo` | `LOCPAFormSubstanceUseHistory` |
| 685 | `dbo` | `logs` |
| 686 | `dbo` | `LosAngelesCountyBHS` |
| 687 | `dbo` | `MADPH` |
| 688 | `dbo` | `MandatoryTBAndSTIEducation` |
| 689 | `dbo` | `MassachusettsCentralRegistry` |
| 690 | `dbo` | `MasterBenzoRisk` |
| 691 | `dbo` | `MasterFamilyHistory` |
| 692 | `dbo` | `MasterHousingStatus` |
| 693 | `dbo` | `MasterMedicalHistory` |
| 694 | `dbo` | `MasterPMP` |
| 695 | `dbo` | `MasterSignature` |
| 696 | `dbo` | `MATandDriving` |
| 697 | `dbo` | `MATHistoryPhysicalDiagnosis` |
| 698 | `dbo` | `MATHistoryPhysicalSubstanceUseHistory` |
| 699 | `dbo` | `MCRC42CFRPart2andHIPAAForm` |
| 700 | `dbo` | `MDAuthorizationtoDiscloseSubstanceUseTreatment` |
| 701 | `dbo` | `MDCarelonROI` |
| 702 | `dbo` | `MDHealthHomeInformedConsent` |
| 703 | `dbo` | `MDHealthHomeNote` |
| 704 | `dbo` | `MDHealthHomeParticipantIntake` |
| 705 | `dbo` | `MedDetermination` |
| 706 | `dbo` | `MedDeterminationDisorderDiagnosis` |
| 707 | `dbo` | `MedHistory` |
| 708 | `dbo` | `MedicaidFinancialApplication` |
| 709 | `dbo` | `MedicaidTreatmentPlanReview` |
| 710 | `dbo` | `Medical_ROS` |
| 711 | `dbo` | `MedicalContract` |
| 712 | `dbo` | `MedicalExam` |
| 713 | `dbo` | `MedicalFormOrService` |
| 714 | `dbo` | `MedicalHistories` |
| 715 | `dbo` | `MedicalScreening` |
| 716 | `dbo` | `MedicalStatus` |
| 717 | `dbo` | `MedicalStatuses` |
| 718 | `dbo` | `MedicationInductionAssessment` |
| 719 | `dbo` | `MedicationRecord` |
| 720 | `dbo` | `Medications` |
| 721 | `dbo` | `Medicine` |
| 722 | `dbo` | `meds` |
| 723 | `dbo` | `MentalHealthInformedConsent` |
| 724 | `dbo` | `MentalHealthProgressNoteDiagnosis` |
| 725 | `dbo` | `MentalHealthProgressNoteDiagnosisRevised` |
| 726 | `dbo` | `MentalHealthProgressNoteRevised` |
| 727 | `dbo` | `MentalHealthSymptomScreening` |
| 728 | `dbo` | `MetalHealthHospitalizationDetails` |
| 729 | `dbo` | `MethadoneAssistedReport` |
| 730 | `dbo` | `MethadoneChainofCustodyRecord` |
| 731 | `dbo` | `MethadoneMaintenaceLevel_1_3` |
| 732 | `dbo` | `MIAdvancedDirective` |
| 733 | `dbo` | `MIASAMAuthorizationForm` |
| 734 | `dbo` | `MIAssessmentforWDC` |
| 735 | `dbo` | `MICommunicableDiseaseScreening` |
| 736 | `dbo` | `MIFASScreen` |
| 737 | `dbo` | `MIFASScreenCheckGridData` |
| 738 | `dbo` | `Military` |
| 739 | `dbo` | `MIMDHHS` |
| 740 | `dbo` | `MIMDHSS` |
| 741 | `dbo` | `MIOrientationChecklist` |
| 742 | `dbo` | `MIRecipientRights` |
| 743 | `dbo` | `MITreatmentPlanReview` |
| 744 | `dbo` | `MNCompAssesPatientInforamtion` |
| 745 | `dbo` | `MNComprehensiveAssessment` |
| 746 | `dbo` | `MNComprehensiveAssessmentDimentionFive` |
| 747 | `dbo` | `MNComprehensiveAssessmentDimentionFour` |
| 748 | `dbo` | `MNComprehensiveAssessmentDimentionOne` |
| 749 | `dbo` | `MNComprehensiveAssessmentDimentionSix` |
| 750 | `dbo` | `MNComprehensiveAssessmentDimentionThree` |
| 751 | `dbo` | `MNComprehensiveAssessmentDimentionTwo` |
| 752 | `dbo` | `MNComprehensiveAssessmentEducationalHistory` |
| 753 | `dbo` | `MNComprehensiveAssessmentFamilyhelthHistory` |
| 754 | `dbo` | `MNComprehensiveAssessmentFamilyHistory` |
| 755 | `dbo` | `MNComprehensiveAssessmentLegalHistory` |
| 756 | `dbo` | `MNComprehensiveAssessmentLevelOfCare` |
| 757 | `dbo` | `MNComprehensiveAssessmentMedication` |
| 758 | `dbo` | `MNComprehensiveAssessmentOccupationalHistory` |
| 759 | `dbo` | `MNComprehensiveAssessmentSexualHistory` |
| 760 | `dbo` | `MNComprehensiveAssessmentSocialHistory` |
| 761 | `dbo` | `MNComprehensiveAssessmentTraumaHistory` |
| 762 | `dbo` | `MNComprehensiveAssessmentVeteranStatus` |
| 763 | `dbo` | `MNIndividualAbusePreventionPlan` |
| 764 | `dbo` | `MNIntakeChecklist` |
| 765 | `dbo` | `MNPatientBillOfRights` |
| 766 | `dbo` | `MNTreatmentServiceReview` |
| 767 | `dbo` | `MOCommunityResourceAssessment` |
| 768 | `dbo` | `MoCommunityResourceAssessmentDiagnosis` |
| 769 | `dbo` | `MoCommunityResourceSubstanceUseHistory` |
| 770 | `dbo` | `MoCommunitySupportDiagnosis` |
| 771 | `dbo` | `MOCommunitySupportProgressNote` |
| 772 | `dbo` | `MOConsentCentralRegistryMissouri` |
| 773 | `dbo` | `MOOrientationChecklist` |
| 774 | `dbo` | `MSWInformation` |
| 775 | `dbo` | `MTQASPeriodicAssessment` |
| 776 | `dbo` | `MultipleRegistrationConsentV2` |
| 777 | `dbo` | `MultipleRegistrationConsentV2GridData` |
| 778 | `dbo` | `NC974708` |
| 779 | `dbo` | `NCCentralRegistryERClosureAuth` |
| 780 | `dbo` | `NCConsentAuthDisclosureSubDisorder` |
| 781 | `dbo` | `NCConsenttoCentralRegistry` |
| 782 | `dbo` | `NCConsenttoDisclosetoCentralRegistry` |
| 783 | `dbo` | `NCCRCEmergencyNotification` |
| 784 | `dbo` | `NCInitialTransitionDischargePlan` |
| 785 | `dbo` | `NCPersonCenteredProfile` |
| 786 | `dbo` | `NCPIE` |
| 787 | `dbo` | `NCPIEDiagnosis` |
| 788 | `dbo` | `NCPIEUDS` |
| 789 | `dbo` | `NEConsentforDualEnrollment` |
| 790 | `dbo` | `NeedsReportsMaster` |
| 791 | `dbo` | `NewAdmissionAssessment` |
| 792 | `dbo` | `NewAdmissionAssessmentAllergy` |
| 793 | `dbo` | `NewAdmissionAssessmentASAMDimension1` |
| 794 | `dbo` | `NewAdmissionAssessmentASAMDimension2` |
| 795 | `dbo` | `NewAdmissionAssessmentASAMDimension3` |
| 796 | `dbo` | `NewAdmissionAssessmentASAMDimension4` |
| 797 | `dbo` | `NewAdmissionAssessmentASAMDimension5` |
| 798 | `dbo` | `NewAdmissionAssessmentASAMDimension6` |
| 799 | `dbo` | `NewAdmissionAssessmentFormReferral` |
| 800 | `dbo` | `NewAdmissionAssessmentMedication` |
| 801 | `dbo` | `NewAdmissionAssessmentMedicationGrid` |
| 802 | `dbo` | `NewAdmissionAssessmentMHPractitionersGrid` |
| 803 | `dbo` | `NewAdmissionAssessmentPractitionersGrid` |
| 804 | `dbo` | `NewAdmissionAssessmentPregnancyGrid` |
| 805 | `dbo` | `NewAdmissionAssessmentReferrals` |
| 806 | `dbo` | `NewAdmissionAssessmentSubstanceUseHistory` |
| 807 | `dbo` | `NewAdmissionAssessmentTreatmentHistory` |
| 808 | `dbo` | `NewBenefitVerification` |
| 809 | `dbo` | `NewCASH` |
| 810 | `dbo` | `NewDischargeTransferPlanForm` |
| 811 | `dbo` | `NewDischargeTransferPlanForm_03192025` |
| 812 | `dbo` | `NewDischargeTransferPlanUDS` |
| 813 | `dbo` | `NewDTPFMedicalHistory` |
| 814 | `dbo` | `NewDTPFormClinicalSummaryReferral` |
| 815 | `dbo` | `NewDTPFormCurrentPrescribedMedication` |
| 816 | `dbo` | `NewDTPFormDiagnosis` |
| 817 | `dbo` | `NewDTPFormProblem` |
| 818 | `dbo` | `NewDTPFormReferral` |
| 819 | `dbo` | `NewDTPFormRxOrder` |
| 820 | `dbo` | `NewDTPFormSocioEconomicConditions` |
| 821 | `dbo` | `NewDTPFormTreatmentEpisodeSummary` |
| 822 | `dbo` | `NewDTPFPriorSubstanceUseTreatmentHistory` |
| 823 | `dbo` | `NewPeriodicReassessment` |
| 824 | `dbo` | `NewPeriodicReassessmentCounselorReview` |
| 825 | `dbo` | `NewPeriodicReassessmentD1` |
| 826 | `dbo` | `NewPeriodicReassessmentD2` |
| 827 | `dbo` | `NewPeriodicReassessmentD3` |
| 828 | `dbo` | `NewPeriodicReassessmentD4` |
| 829 | `dbo` | `NewPeriodicReassessmentD5` |
| 830 | `dbo` | `NewPeriodicReassessmentD6` |
| 831 | `dbo` | `NewPeriodicReassessmentPractitioners` |
| 832 | `dbo` | `NewPeriodicReassessmentPregnancyGrid` |
| 833 | `dbo` | `NewPeriodicReassessmentUDS` |
| 834 | `dbo` | `NinetyDayReview` |
| 835 | `dbo` | `NinetyDayReviewUAResult` |
| 836 | `dbo` | `NMMultipleRegistrationProgram` |
| 837 | `dbo` | `NODSCLIP_GamblingAssessment` |
| 838 | `dbo` | `NoLoiteringformRevised` |
| 839 | `dbo` | `NondiscriminationNoticeFinalEnglish` |
| 840 | `dbo` | `NondiscriminationNoticeFinalSpanish` |
| 841 | `dbo` | `NorthCarolinaCrisisPlan` |
| 842 | `dbo` | `Notes` |
| 843 | `dbo` | `NoticeofPrivacyPractice` |
| 844 | `dbo` | `NoticeOfPrivacyPracticesBAART` |
| 845 | `dbo` | `NoticeofPrivacyPracticesDC` |
| 846 | `dbo` | `NoticeOfPrivacyPracticesHCRC` |
| 847 | `dbo` | `NoticeOfPrivacyPracticesMedmark` |
| 848 | `dbo` | `NoticeOfPrivacyPracticesRevised` |
| 849 | `dbo` | `NursingAssessment` |
| 850 | `dbo` | `NursingAssessmentSubstanceHistory` |
| 851 | `dbo` | `NursingEvaluation` |
| 852 | `dbo` | `NursingEvaluationAllergy` |
| 853 | `dbo` | `NursingEvaluationCurrentMedication` |
| 854 | `dbo` | `NursingEvaluationSubstanceUseHistory` |
| 855 | `dbo` | `NursingEvaluationVitals` |
| 856 | `dbo` | `NVAdmissionAssessmentAddendum` |
| 857 | `dbo` | `NVAdmissionAssessmentAlcohol` |
| 858 | `dbo` | `NVAdmissionAssessmentCannabis` |
| 859 | `dbo` | `NVAdmissionAssessmentHallucinogens` |
| 860 | `dbo` | `NVAdmissionAssessmentInhalants` |
| 861 | `dbo` | `NVAdmissionAssessmentOpioids` |
| 862 | `dbo` | `NVAdmissionAssessmentPhencyclidine` |
| 863 | `dbo` | `NVAdmissionAssessmentSedative` |
| 864 | `dbo` | `NVAdmissionAssessmentStimulants` |
| 865 | `dbo` | `NVAdmissionAssessmentTobacco` |
| 866 | `dbo` | `NVAdmissionSupplemental` |
| 867 | `dbo` | `NVAdmissionSupplementalMaster` |
| 868 | `dbo` | `NVComprehensiveWrittenReport` |
| 869 | `dbo` | `NVConsentPreventMultipleEnrollments` |
| 870 | `dbo` | `NVConsentPreventMultipleEnrollmentsGridData` |
| 871 | `dbo` | `NVDischargeSupplementalForm` |
| 872 | `dbo` | `NVDischargeSupplementalMaster` |
| 873 | `dbo` | `NVLOCUSAssessment` |
| 874 | `dbo` | `NVMentalHealthAssessment` |
| 875 | `dbo` | `NVOutpatientScreening` |
| 876 | `dbo` | `NVPatientRights` |
| 877 | `dbo` | `NVPrenatalChecklist` |
| 878 | `dbo` | `NVPrenatalPregnancyHistory` |
| 879 | `dbo` | `OBOTProviderProgressNoteObjective` |
| 880 | `dbo` | `OBOTProviderProgressNoteSubjective` |
| 881 | `dbo` | `OBOTStabilityIndex` |
| 882 | `dbo` | `OMRBenzodiazepinePolicyException` |
| 883 | `dbo` | `OpioDoseStatus` |
| 884 | `dbo` | `OpioidOverdoseRisks` |
| 885 | `dbo` | `OpioidTretamentProgram` |
| 886 | `dbo` | `OpioidTretamentProgramCurrentRxOrders` |
| 887 | `dbo` | `OptionListItems` |
| 888 | `dbo` | `OptionLists` |
| 889 | `dbo` | `OptumUninsuredEligibility` |
| 890 | `dbo` | `OrderforServices` |
| 891 | `dbo` | `OrderRelationship` |
| 892 | `dbo` | `OrientationChecklistNew` |
| 893 | `dbo` | `OrientationVerification` |
| 894 | `dbo` | `OtherArrests` |
| 895 | `dbo` | `OTPHealthHomeOptOut` |
| 896 | `dbo` | `OTPProviderProgressFollowUpNoteObjective` |
| 897 | `dbo` | `OTPProviderProgressFollowUpNoteSubjective` |
| 898 | `dbo` | `OTPRequestforCourtesyDosing` |
| 899 | `dbo` | `OTPRequestforCourtesyDosingDiagnosis` |
| 900 | `dbo` | `OutpatientOrientationChecklist` |
| 901 | `dbo` | `OutpatientPreAdmission` |
| 902 | `dbo` | `OutpatientSUMHIntegratedAssessment` |
| 903 | `dbo` | `OverdoseAssessment` |
| 904 | `dbo` | `PACounselorReview` |
| 905 | `dbo` | `PADimension1` |
| 906 | `dbo` | `PADimension2` |
| 907 | `dbo` | `PADimension3` |
| 908 | `dbo` | `PADimension4` |
| 909 | `dbo` | `PADimension5` |
| 910 | `dbo` | `PADimension6` |
| 911 | `dbo` | `Paragraph` |
| 912 | `dbo` | `Paragraph_01212025` |
| 913 | `dbo` | `PastMedications` |
| 914 | `dbo` | `PatientAnnualReviewChecklist` |
| 915 | `dbo` | `PatientDependent` |
| 916 | `dbo` | `PatientEducationSignOffForm` |
| 917 | `dbo` | `PatientElectiontoSelfPay` |
| 918 | `dbo` | `PatientFeeScheduleHCRCMain` |
| 919 | `dbo` | `PatientFeeScheduleV3` |
| 920 | `dbo` | `PatientFinancialResponsibilityAgreement` |
| 921 | `dbo` | `PatientHealthInsuranceWaiver` |
| 922 | `dbo` | `PatientInformationSheet` |
| 923 | `dbo` | `PatientRefusalOfCare` |
| 924 | `dbo` | `PatientRightsandResponsibilities` |
| 925 | `dbo` | `PatientRightsAndResponsibilitiesV2` |
| 926 | `dbo` | `Patients` |
| 927 | `dbo` | `PatientSafetyPlan` |
| 928 | `dbo` | `PatientsBillOfRight` |
| 929 | `dbo` | `PatientServiceReceipt` |
| 930 | `dbo` | `PatientsHandBook` |
| 931 | `dbo` | `payment_info` |
| 932 | `dbo` | `pbiMeasures` |
| 933 | `dbo` | `PDFQuestions` |
| 934 | `dbo` | `PeriodicReassessment` |
| 935 | `dbo` | `PeriodicReassessmentUDS` |
| 936 | `dbo` | `PersonalSafetyPlan` |
| 937 | `dbo` | `PhysicalExams` |
| 938 | `dbo` | `PhysicianJustificationUseBenzodiazepine` |
| 939 | `dbo` | `PlacerASAM` |
| 940 | `dbo` | `PlacerCalOMSAdmissionQuestionnaire` |
| 941 | `dbo` | `PlacerCoMedicalHistory` |
| 942 | `dbo` | `PlacerCoMedicalHistoryCurrentMedication` |
| 943 | `dbo` | `PlacerCoMedicalHistoryPastMedication` |
| 944 | `dbo` | `PMPConsent` |
| 945 | `dbo` | `PPDTest` |
| 946 | `dbo` | `Practitioners` |
| 947 | `dbo` | `PreAdmisionPrescriptionMedications` |
| 948 | `dbo` | `PreAdmissionFormReferral` |
| 949 | `dbo` | `PreAdmissionMedicalHistory` |
| 950 | `dbo` | `PreAdmissionMedication` |
| 951 | `dbo` | `PreAdmissionOTCMedication` |
| 952 | `dbo` | `PreAdmissionPractitioners` |
| 953 | `dbo` | `PreAdmissionPregnancy` |
| 954 | `dbo` | `PreAdmissionSubstanceUseHistory` |
| 955 | `dbo` | `PreAdmissionTreatmentHistory` |
| 956 | `dbo` | `PreferredPharmacy` |
| 957 | `dbo` | `Pregnancy` |
| 958 | `dbo` | `PregnancyandMethadoneAgreement` |
| 959 | `dbo` | `PregnancyRefusalOfCare` |
| 960 | `dbo` | `PregnancyWaiver` |
| 961 | `dbo` | `PrenatalChecklistPractitioners` |
| 962 | `dbo` | `PrescriptionMedicationCriteriaGrid` |
| 963 | `dbo` | `PrescriptionReport` |
| 964 | `dbo` | `PreventMultipleEnrollmentsRevised` |
| 965 | `dbo` | `PreventMultipleEnrollmentsRevised_bak20241119` |
| 966 | `dbo` | `PrimaryDischargeReason` |
| 967 | `dbo` | `PrimaryReferralSource` |
| 968 | `dbo` | `PriorMentalHealthTreatment` |
| 969 | `dbo` | `PriorSubstanceAbuse` |
| 970 | `dbo` | `PriorSubstanceUseCriteriaGrid` |
| 971 | `dbo` | `PriorSubstanceUseTreatmentHistory` |
| 972 | `dbo` | `ProgramFormMapping` |
| 973 | `dbo` | `ProgramNameForCostofServicesAgreement` |
| 974 | `dbo` | `ProgressAssessmentWorksheet` |
| 975 | `dbo` | `ProgressNote` |
| 976 | `dbo` | `ProgressNoteDiagnosis` |
| 977 | `dbo` | `ProgressNoteUDS` |
| 978 | `dbo` | `PsychEvalFormDiagnosis` |
| 979 | `dbo` | `PsychEvalFormSubstanceUseHistory` |
| 980 | `dbo` | `PsychiatricMedicines` |
| 981 | `dbo` | `PsychiatricStatus` |
| 982 | `dbo` | `PsychiatricStatuses` |
| 983 | `dbo` | `Question` |
| 984 | `dbo` | `QuestionAnswerOption` |
| 985 | `dbo` | `ReasonForDenial` |
| 986 | `dbo` | `ReAssessment` |
| 987 | `dbo` | `ReAssessmentFamily` |
| 988 | `dbo` | `ReAssessmentLegal` |
| 989 | `dbo` | `ReAssessmentMentalHealth` |
| 990 | `dbo` | `ReAssessmentOccupational` |
| 991 | `dbo` | `ReAssessmentPhysicalHealth` |
| 992 | `dbo` | `ReAssessmentPractitioner` |
| 993 | `dbo` | `ReAssessmentSocial` |
| 994 | `dbo` | `ReAssessmentStrength` |
| 995 | `dbo` | `ReAssessmentSubstanceUse` |
| 996 | `dbo` | `ReAssessmentSummary` |
| 997 | `dbo` | `ReAssessmentTreatment` |
| 998 | `dbo` | `ReAssessmentUAResult` |
| 999 | `dbo` | `RecentPregnancy` |
| 1000 | `dbo` | `ReclassifySignedServicesHistory` |
| 1001 | `dbo` | `Recommendation` |
| 1002 | `dbo` | `RecordsReleaseForm` |
| 1003 | `dbo` | `Referral` |
| 1004 | `dbo` | `ReferralForm` |
| 1005 | `dbo` | `ReferralsMenHandSubUseDServices` |
| 1006 | `dbo` | `RegularMedication` |
| 1007 | `dbo` | `RelapsePriorMentalHealthTreatment` |
| 1008 | `dbo` | `RelapsePriorSubstanceUse` |
| 1009 | `dbo` | `ReleaseInNetwork` |
| 1010 | `dbo` | `ReleaseOutNetwork` |
| 1011 | `dbo` | `ReportHeader` |
| 1012 | `dbo` | `RequestReleaseofMedicalRecordsV2` |
| 1013 | `dbo` | `RequirementToProvideNoticeToClient` |
| 1014 | `dbo` | `Residence` |
| 1015 | `dbo` | `Resources` |
| 1016 | `dbo` | `ReviewOfSystems` |
| 1017 | `dbo` | `RevisedTakeHomeJustification` |
| 1018 | `dbo` | `RevocationofPtElectiontoSPForSrvAgt` |
| 1019 | `dbo` | `RIBHOLD` |
| 1020 | `dbo` | `RICurrentCareEducationEnrollment` |
| 1021 | `dbo` | `RIHealthHomeCareReview` |
| 1022 | `dbo` | `RIHealthHomeConsentToReceive` |
| 1023 | `dbo` | `RIHealthHomeEligibilityFollUpChecklist` |
| 1024 | `dbo` | `RIHealthHomeHistory` |
| 1025 | `dbo` | `RIHealthHomeHistoryAllergy` |
| 1026 | `dbo` | `RIHealthHomeHistoryCurrentMedication` |
| 1027 | `dbo` | `RIHealthHomeNote` |
| 1028 | `dbo` | `RIHealthHomePatientCenteredPlan` |
| 1029 | `dbo` | `RIHealthHomeTriageAssessment` |
| 1030 | `dbo` | `RIOverdosePreventionEducation` |
| 1031 | `dbo` | `RIPHQ9` |
| 1032 | `dbo` | `RiskAssessment` |
| 1033 | `dbo` | `RNP_Abilites` |
| 1034 | `dbo` | `RNP_AdmissionHistoryList` |
| 1035 | `dbo` | `RNP_AdmissionPhysicalHistory` |
| 1036 | `dbo` | `RNP_Allergies` |
| 1037 | `dbo` | `RNP_Assessment` |
| 1038 | `dbo` | `RNP_Assessment_51` |
| 1039 | `dbo` | `RNP_AssessmentDetails` |
| 1040 | `dbo` | `RNP_AuthorizationToObtainOrRelease` |
| 1041 | `dbo` | `RNP_AuthorizationToObtainOrRelease_pop` |
| 1042 | `dbo` | `RNP_Children` |
| 1043 | `dbo` | `RNP_Diagnosis` |
| 1044 | `dbo` | `RNP_EmergencyContact` |
| 1045 | `dbo` | `RNP_FagerStromTestStandAlone` |
| 1046 | `dbo` | `RNP_FamilyOfOrigin` |
| 1047 | `dbo` | `RNP_Hipaa` |
| 1048 | `dbo` | `RNP_Hospitalization` |
| 1049 | `dbo` | `RNP_IntakeHistory` |
| 1050 | `dbo` | `RNP_IntakeHistoryDiagnosis` |
| 1051 | `dbo` | `RNP_IntakeHistoryPrescription` |
| 1052 | `dbo` | `RNP_LevelDetails` |
| 1053 | `dbo` | `RNP_Medications` |
| 1054 | `dbo` | `RNP_NodsDetails` |
| 1055 | `dbo` | `RNP_NuclearFamily` |
| 1056 | `dbo` | `RNP_Opportunities` |
| 1057 | `dbo` | `RNP_OrientationChecklist` |
| 1058 | `dbo` | `RNP_PatientProblems` |
| 1059 | `dbo` | `RNP_PeriodicAssessment` |
| 1060 | `dbo` | `RNP_PlacementCriteria` |
| 1061 | `dbo` | `RNP_Preferances` |
| 1062 | `dbo` | `RNP_PrescriptionMedication` |
| 1063 | `dbo` | `RNP_PriorSubstanceAbuseMentalHealthTreatments` |
| 1064 | `dbo` | `RNP_PsychiatricEvaluation` |
| 1065 | `dbo` | `RNP_PsychiatricEvaluation_CurrentMedications` |
| 1066 | `dbo` | `RNP_ReceivingMedicalCare` |
| 1067 | `dbo` | `RNP_ShortFormDiagnosis` |
| 1068 | `dbo` | `RNP_Signature` |
| 1069 | `dbo` | `RNP_StagesOfChange` |
| 1070 | `dbo` | `RNP_Strengths` |
| 1071 | `dbo` | `RNP_SubstanceHistory` |
| 1072 | `dbo` | `RNP_SubstanceHistory_IntakeHistory` |
| 1073 | `dbo` | `RNP_SubstanceHistory_PeriodicAssessment` |
| 1074 | `dbo` | `RNP_SubstanceHistory_PsychiatricEvaluation` |
| 1075 | `dbo` | `RNP_SubstanceUseHistory` |
| 1076 | `dbo` | `RNP_TBSignsAndSymptoms` |
| 1077 | `dbo` | `SacramentoDHS` |
| 1078 | `dbo` | `SAFETProtocolwithCSSRS` |
| 1079 | `dbo` | `SafetyContract` |
| 1080 | `dbo` | `SCConsentAndAuthorizationforDisclosureofSUD` |
| 1081 | `dbo` | `SCConsentForAutopsyROI` |
| 1082 | `dbo` | `SCConsentReleaseCentralRegistry` |
| 1083 | `dbo` | `SchemaVersions` |
| 1084 | `dbo` | `SCReleaseForEmergencyGuestDosing` |
| 1085 | `dbo` | `ScxClientActivityHistory` |
| 1086 | `dbo` | `ScxFormMapping` |
| 1087 | `dbo` | `ScxSigContainer` |
| 1088 | `dbo` | `ScxUserESig` |
| 1089 | `dbo` | `SecondaryDischargeReason` |
| 1090 | `dbo` | `SecondaryReferralSource` |
| 1091 | `dbo` | `Service_Information` |
| 1092 | `dbo` | `servicetrigger_bak_10252024` |
| 1093 | `dbo` | `ServiceTriggerConfig` |
| 1094 | `dbo` | `servicetriggerconfig_01162026` |
| 1095 | `dbo` | `servicetriggerconfig_12152025` |
| 1096 | `dbo` | `SF_AdultNutritionalScreening` |
| 1097 | `dbo` | `SF_ApprovedNarcotic` |
| 1098 | `dbo` | `SF_BehavioralScreen` |
| 1099 | `dbo` | `SF_BehavioralScreenScoring` |
| 1100 | `dbo` | `SF_BenzodiazepineEducation` |
| 1101 | `dbo` | `SF_CardiacRiskFactors` |
| 1102 | `dbo` | `SF_Ciwa` |
| 1103 | `dbo` | `SF_ClientMedicalDetails` |
| 1104 | `dbo` | `SF_ConcentForTB` |
| 1105 | `dbo` | `SF_ConsentForEmergencyContact` |
| 1106 | `dbo` | `SF_ConsentForFollowUp` |
| 1107 | `dbo` | `SF_ConsentForRXInfo` |
| 1108 | `dbo` | `SF_ConsentToArrestDetention` |
| 1109 | `dbo` | `SF_ConsentToHealthDepartment` |
| 1110 | `dbo` | `SF_Cows` |
| 1111 | `dbo` | `SF_DataForms` |
| 1112 | `dbo` | `SF_dataforms_01162026` |
| 1113 | `dbo` | `SF_dataforms_12152025` |
| 1114 | `dbo` | `SF_DetoxificationAcknowledgement` |
| 1115 | `dbo` | `SF_Dropdown` |
| 1116 | `dbo` | `SF_DrugAdministrationType` |
| 1117 | `dbo` | `SF_DrugChoice` |
| 1118 | `dbo` | `SF_DSM-V Criteria` |
| 1119 | `dbo` | `SF_EmergencyTreatment` |
| 1120 | `dbo` | `SF_FactsNInstruction` |
| 1121 | `dbo` | `SF_FamilyHistory` |
| 1122 | `dbo` | `SF_GeneralHealthInformation` |
| 1123 | `dbo` | `SF_Guidline` |
| 1124 | `dbo` | `SF_HIPAAConfidentiality` |
| 1125 | `dbo` | `SF_HivEducation` |
| 1126 | `dbo` | `SF_IllicitSubstance` |
| 1127 | `dbo` | `SF_IllnessHistory` |
| 1128 | `dbo` | `SF_InfectiousBehavioralInterview` |
| 1129 | `dbo` | `SF_InfectiousDisease` |
| 1130 | `dbo` | `SF_InfectiousDiseaseNBehavioralScreen` |
| 1131 | `dbo` | `SF_IVTrackRecord` |
| 1132 | `dbo` | `SF_MedicalHistory` |
| 1133 | `dbo` | `SF_NarcoticSource` |
| 1134 | `dbo` | `SF_OnSiteVerficationTest` |
| 1135 | `dbo` | `SF_OrientationChklist` |
| 1136 | `dbo` | `SF_Pains` |
| 1137 | `dbo` | `SF_PastHistory` |
| 1138 | `dbo` | `SF_PATIENT_PRE_ADMISSION` |
| 1139 | `dbo` | `SF_PatientGrievanceProcedure` |
| 1140 | `dbo` | `SF_PatientIllicitSubstance` |
| 1141 | `dbo` | `SF_PatientLegalPrescription` |
| 1142 | `dbo` | `SF_PatientMedicalCondition` |
| 1143 | `dbo` | `SF_PatientMedicalHistory` |
| 1144 | `dbo` | `SF_PatientMedicalHistroy` |
| 1145 | `dbo` | `SF_PatientPreAdmission` |
| 1146 | `dbo` | `SF_PatientPreAdmission_11182024` |
| 1147 | `dbo` | `SF_PatientPreAdmission_OtherIllicit` |
| 1148 | `dbo` | `SF_PatientPreAdmissionReferralSource` |
| 1149 | `dbo` | `SF_PhysicalExam` |
| 1150 | `dbo` | `SF_PhysiologicalAddictionSummary` |
| 1151 | `dbo` | `SF_Physiology` |
| 1152 | `dbo` | `SF_PostDischargeFollowUp` |
| 1153 | `dbo` | `SF_PreAdmissionPrescription` |
| 1154 | `dbo` | `SF_Program` |
| 1155 | `dbo` | `SF_ReferralSource` |
| 1156 | `dbo` | `SF_RegistrationMode` |
| 1157 | `dbo` | `SF_RightNResponsibility` |
| 1158 | `dbo` | `SF_ScreeningIntakeNotes` |
| 1159 | `dbo` | `SF_Signature` |
| 1160 | `dbo` | `SF_SuicideRisk` |
| 1161 | `dbo` | `SF_SuicideRiskStandAlone` |
| 1162 | `dbo` | `SF_TreatmentProgramMedication` |
| 1163 | `dbo` | `SF_UnderstandingOfTreatment` |
| 1164 | `dbo` | `SFTPActivityTracking` |
| 1165 | `dbo` | `SFTPLabDetail` |
| 1166 | `dbo` | `SFTPVOBConnectionInfo` |
| 1167 | `dbo` | `SigFormDetails` |
| 1168 | `dbo` | `sigformdetails_bak_10252024` |
| 1169 | `dbo` | `Signature` |
| 1170 | `dbo` | `SignsOfWithdrawals` |
| 1171 | `dbo` | `SingnatureForm` |
| 1172 | `dbo` | `singnatureform_bak_10252024` |
| 1173 | `dbo` | `SlidingScaleApp` |
| 1174 | `dbo` | `SlidingScaleFeeGuidelines` |
| 1175 | `dbo` | `SmartcareRelease` |
| 1176 | `dbo` | `SMSConsent` |
| 1177 | `dbo` | `SMSTextConsentForm` |
| 1178 | `dbo` | `Soapnote` |
| 1179 | `dbo` | `Social` |
| 1180 | `dbo` | `SocialLifeStyle` |
| 1181 | `dbo` | `SOWS` |
| 1182 | `dbo` | `SpecificASAMDimensions` |
| 1183 | `dbo` | `SpecificSubstanceMaster` |
| 1184 | `dbo` | `Spirituality` |
| 1185 | `dbo` | `SSRSForm` |
| 1186 | `dbo` | `StateFactForm` |
| 1187 | `dbo` | `StocktonCRIforDualEnrlCheckAddress` |
| 1188 | `dbo` | `subcategory` |
| 1189 | `dbo` | `Substance` |
| 1190 | `dbo` | `SubstanceAbuseHistory` |
| 1191 | `dbo` | `SubstanceDetails` |
| 1192 | `dbo` | `SubstanceHistoryCriteriaGrid` |
| 1193 | `dbo` | `SubstanceUse` |
| 1194 | `dbo` | `SubstanceUseDisorderInitial` |
| 1195 | `dbo` | `SubstanceUseHistory` |
| 1196 | `dbo` | `SUDOutcomeToolDischarge` |
| 1197 | `dbo` | `SuicideSeverityRatingScale` |
| 1198 | `dbo` | `SupplementalAssessment` |
| 1199 | `dbo` | `sysdiagrams` |
| 1200 | `dbo` | `SystemAssessment` |
| 1201 | `dbo` | `systranschemas` |
| 1202 | `dbo` | `Table` |
| 1203 | `dbo` | `TakeHomeAgreement` |
| 1204 | `dbo` | `TakeHomeAgreementandDiversionControl` |
| 1205 | `dbo` | `TakeHomeAgreementandDiversionControl_06182026` |
| 1206 | `dbo` | `TakeHomeGuidelinesForm` |
| 1207 | `dbo` | `TakeHomeJustificationV2` |
| 1208 | `dbo` | `TakeHomeRiskAssessment` |
| 1209 | `dbo` | `TakeHomeViewModel` |
| 1210 | `dbo` | `TaskDependencies` |
| 1211 | `dbo` | `tbl270FILEID` |
| 1212 | `dbo` | `tbl3pARNOTE` |
| 1213 | `dbo` | `tbl3pauthtemp` |
| 1214 | `dbo` | `tbl3PAYauth` |
| 1215 | `dbo` | `tbl3paybenefits` |
| 1216 | `dbo` | `tbl3PAYPROG` |
| 1217 | `dbo` | `tbl3pBill` |
| 1218 | `dbo` | `tbl3PBILLHISTORY` |
| 1219 | `dbo` | `tbl3pClaim` |
| 1220 | `dbo` | `tbl3PClaim_ChangeLog` |
| 1221 | `dbo` | `tbl3pClaim_Test` |
| 1222 | `dbo` | `tbl3pClaimBatch` |
| 1223 | `dbo` | `tbl3pClaimBatchEncounter` |
| 1224 | `dbo` | `tbl3pClaimLineItem` |
| 1225 | `dbo` | `tbl3pClaimLineItem_Test` |
| 1226 | `dbo` | `tbl3pClaimLineItemActivity` |
| 1227 | `dbo` | `tbl3pClaimLineItemActivity_1stMay2025` |
| 1228 | `dbo` | `tbl3pClaimNote` |
| 1229 | `dbo` | `tbl3pClaimRemit` |
| 1230 | `dbo` | `tbl3pCodes` |
| 1231 | `dbo` | `tbl3pCoIns` |
| 1232 | `dbo` | `tbl3pElig` |
| 1233 | `dbo` | `tbl3pEligReq` |
| 1234 | `dbo` | `tbl3pGROUP` |
| 1235 | `dbo` | `tbl3pLineItem` |
| 1236 | `dbo` | `tbl3pPAY` |
| 1237 | `dbo` | `tbl3pRemitBatch` |
| 1238 | `dbo` | `tbl3pRemitBatchClaim` |
| 1239 | `dbo` | `tbl3pREMITBATCHHEAD` |
| 1240 | `dbo` | `tbl3pRemitLineItem` |
| 1241 | `dbo` | `tbl3pRemitUnapplied` |
| 1242 | `dbo` | `tbl3PSETUP` |
| 1243 | `dbo` | `tbl3psetupAttPhysHistory` |
| 1244 | `dbo` | `tbl3PSETUPLOGHISTORY` |
| 1245 | `dbo` | `tbl3PSRVFEE` |
| 1246 | `dbo` | `tbl835Template` |
| 1247 | `dbo` | `tbl837FILEID` |
| 1248 | `dbo` | `tblABHSReasondropdown` |
| 1249 | `dbo` | `tblAccts` |
| 1250 | `dbo` | `tblAcctsBkup20240107160000` |
| 1251 | `dbo` | `tblAcctsBkup20240114160000` |
| 1252 | `dbo` | `tblAcctsBkup20240121160000` |
| 1253 | `dbo` | `tblAcctsBkup20240128160000` |
| 1254 | `dbo` | `tblAcctsBkup20240131220000` |
| 1255 | `dbo` | `tblAcctsBkup20240204160000` |
| 1256 | `dbo` | `tblAcctsBkup20240211160000` |
| 1257 | `dbo` | `tblAcctsBkup20240218160000` |
| 1258 | `dbo` | `tblAcctsBkup20240225160000` |
| 1259 | `dbo` | `tblAcctsBkup20240229220000` |
| 1260 | `dbo` | `tblAcctsBkup20240303160000` |
| 1261 | `dbo` | `tblAcctsBkup20240310160001` |
| 1262 | `dbo` | `tblAcctsBkup20240317160000` |
| 1263 | `dbo` | `tblAcctsBkup20240324160000` |
| 1264 | `dbo` | `tblAcctsBkup20240331160001` |
| 1265 | `dbo` | `tblAcctsBkup20240407160000` |
| 1266 | `dbo` | `tblAcctsBkup20240414160000` |
| 1267 | `dbo` | `tblAcctsBkup20240421160001` |
| 1268 | `dbo` | `tblAcctsBkup20240428160001` |
| 1269 | `dbo` | `tblAcctsBkup20240430220001` |
| 1270 | `dbo` | `tblAcctsBkup20240505160000` |
| 1271 | `dbo` | `tblAcctsBkup20240512160000` |
| 1272 | `dbo` | `tblAcctsBkup20240519160000` |
| 1273 | `dbo` | `tblAcctsBkup20240526160000` |
| 1274 | `dbo` | `tblAcctsBkup20240531220000` |
| 1275 | `dbo` | `tblAcctsBkup20240602160000` |
| 1276 | `dbo` | `tblAcctsBkup20240609160000` |
| 1277 | `dbo` | `tblAcctsBkup20240616160000` |
| 1278 | `dbo` | `tblAcctsBkup20240623160001` |
| 1279 | `dbo` | `tblAcctsBkup20240630160000` |
| 1280 | `dbo` | `tblAcctsBkup20240707160000` |
| 1281 | `dbo` | `tblAcctsBkup20240714160000` |
| 1282 | `dbo` | `tblAcctsBkup20240721160000` |
| 1283 | `dbo` | `tblAcctsBkup20240728160000` |
| 1284 | `dbo` | `tblAcctsBkup20240731220000` |
| 1285 | `dbo` | `tblAcctsBkup20240804160001` |
| 1286 | `dbo` | `tblAcctsBkup20240811160000` |
| 1287 | `dbo` | `tblAcctsBkup20240818160001` |
| 1288 | `dbo` | `tblAcctsBkup20240825160000` |
| 1289 | `dbo` | `tblAcctsBkup20240831220000` |
| 1290 | `dbo` | `tblAcctsBkup20240901160000` |
| 1291 | `dbo` | `tblAcctsBkup20240908160000` |
| 1292 | `dbo` | `tblAcctsBkup20240915160000` |
| 1293 | `dbo` | `tblAcctsBkup20240922160001` |
| 1294 | `dbo` | `tblAcctsBkup20240929160000` |
| 1295 | `dbo` | `tblAcctsBkup20240930220000` |
| 1296 | `dbo` | `tblAcctsBkup20241006160000` |
| 1297 | `dbo` | `tblAcctsBkup20241013160000` |
| 1298 | `dbo` | `tblAcctsBkup20241020160000` |
| 1299 | `dbo` | `tblAcctsBkup20241027160000` |
| 1300 | `dbo` | `tblAcctsBkup20241031220000` |
| 1301 | `dbo` | `tblAcctsBkup20241103160000` |
| 1302 | `dbo` | `tblAcctsBkup20241110160000` |
| 1303 | `dbo` | `tblAcctsBkup20241117160000` |
| 1304 | `dbo` | `tblAcctsBkup20241124160000` |
| 1305 | `dbo` | `tblAcctsBkup20241130220000` |
| 1306 | `dbo` | `tblAcctsBkup20241201160000` |
| 1307 | `dbo` | `tblAcctsBkup20241208160000` |
| 1308 | `dbo` | `tblAcctsBkup20241215160001` |
| 1309 | `dbo` | `tblAcctsBkup20241222160000` |
| 1310 | `dbo` | `tblAcctsBkup20241229160000` |
| 1311 | `dbo` | `tblAcctsBkup20241231220000` |
| 1312 | `dbo` | `tblAcctsBkup20250105160001` |
| 1313 | `dbo` | `tblAcctsBkup20250112160000` |
| 1314 | `dbo` | `tblAcctsBkup20250119160000` |
| 1315 | `dbo` | `tblAcctsBkup20250126160000` |
| 1316 | `dbo` | `tblAcctsBkup20250131220002` |
| 1317 | `dbo` | `tblAcctsBkup20250202160000` |
| 1318 | `dbo` | `tblAcctsBkup20250209160000` |
| 1319 | `dbo` | `tblAcctsBkup20250216160000` |
| 1320 | `dbo` | `tblAcctsBkup20250223160001` |
| 1321 | `dbo` | `tblAcctsBkup20250228220000` |
| 1322 | `dbo` | `tblAcctsBkup20250302160000` |
| 1323 | `dbo` | `tblAcctsBkup20250309160000` |
| 1324 | `dbo` | `tblAcctsBkup20250316160001` |
| 1325 | `dbo` | `tblAcctsBkup20250323160001` |
| 1326 | `dbo` | `tblAcctsBkup20250330160001` |
| 1327 | `dbo` | `tblAcctsBkup20250331220001` |
| 1328 | `dbo` | `tblAcctsBkup20250406160000` |
| 1329 | `dbo` | `tblAcctsBkup20250413160000` |
| 1330 | `dbo` | `tblAcctsBkup20250420160001` |
| 1331 | `dbo` | `tblAcctsBkup20250427160000` |
| 1332 | `dbo` | `tblAcctsBkup20250430220000` |
| 1333 | `dbo` | `tblAcctsBkup20250504160000` |
| 1334 | `dbo` | `tblAcctsBkup20250511160000` |
| 1335 | `dbo` | `tblAcctsBkup20250518160001` |
| 1336 | `dbo` | `tblAcctsBkup20250525160000` |
| 1337 | `dbo` | `tblAcctsBkup20250531220002` |
| 1338 | `dbo` | `tblAcctsBkup20250601160000` |
| 1339 | `dbo` | `tblAcctsBkup20250608160000` |
| 1340 | `dbo` | `tblAcctsBkup20250615160001` |
| 1341 | `dbo` | `tblAcctsBkup20250622160001` |
| 1342 | `dbo` | `tblAcctsBkup20250629160000` |
| 1343 | `dbo` | `tblAcctsBkup20250630220000` |
| 1344 | `dbo` | `tblAcctsBkup20250706160000` |
| 1345 | `dbo` | `tblAcctsBkup20250713160000` |
| 1346 | `dbo` | `tblAcctsBkup20250720160000` |
| 1347 | `dbo` | `tblAcctsBkup20250727160000` |
| 1348 | `dbo` | `tblAcctsBkup20250731220001` |
| 1349 | `dbo` | `tblAcctsBkup20250803160001` |
| 1350 | `dbo` | `tblAcctsBkup20250810160000` |
| 1351 | `dbo` | `tblAcctsBkup20250817160000` |
| 1352 | `dbo` | `tblAcctsBkup20250824160001` |
| 1353 | `dbo` | `tblAcctsBkup20250831160000` |
| 1354 | `dbo` | `tblAcctsBkup20250907160000` |
| 1355 | `dbo` | `tblAcctsBkup20250914160000` |
| 1356 | `dbo` | `tblAcctsBkup20250921160000` |
| 1357 | `dbo` | `tblAcctsBkup20250928160001` |
| 1358 | `dbo` | `tblAcctsBkup20250930220000` |
| 1359 | `dbo` | `tblAcctsBkup20251005160000` |
| 1360 | `dbo` | `tblAcctsBkup20251012160000` |
| 1361 | `dbo` | `tblAcctsBkup20251019160001` |
| 1362 | `dbo` | `tblAcctsBkup20251026160000` |
| 1363 | `dbo` | `tblAcctsBkup20251031220000` |
| 1364 | `dbo` | `tblAcctsBkup20251102160000` |
| 1365 | `dbo` | `tblAcctsBkup20251109160000` |
| 1366 | `dbo` | `tblAcctsBkup20251116160000` |
| 1367 | `dbo` | `tblAcctsBkup20251123160000` |
| 1368 | `dbo` | `tblAcctsBkup20251130160000` |
| 1369 | `dbo` | `tblAcctsBkup20251207160000` |
| 1370 | `dbo` | `tblAcctsBkup20251214160000` |
| 1371 | `dbo` | `tblAcctsBkup20251221160000` |
| 1372 | `dbo` | `tblAcctsBkup20251228160000` |
| 1373 | `dbo` | `tblAcctsBkup20251231220000` |
| 1374 | `dbo` | `tblAcctsBkup20260104160000` |
| 1375 | `dbo` | `tblAcctsBkup20260111160000` |
| 1376 | `dbo` | `tblAcctsBkup20260118160000` |
| 1377 | `dbo` | `tblAcctsBkup20260125160001` |
| 1378 | `dbo` | `tblAcctsBkup20260131220000` |
| 1379 | `dbo` | `tblAcctsBkup20260201160000` |
| 1380 | `dbo` | `tblAcctsBkup20260208160000` |
| 1381 | `dbo` | `tblAcctsBkup20260215160000` |
| 1382 | `dbo` | `tblAcctsBkup20260222160000` |
| 1383 | `dbo` | `tblAcctsBkup20260228220001` |
| 1384 | `dbo` | `tblAcctsBkup20260301160000` |
| 1385 | `dbo` | `tblAcctsBkup20260308160000` |
| 1386 | `dbo` | `tblAcctsBkup20260315160000` |
| 1387 | `dbo` | `tblAcctsBkup20260322160000` |
| 1388 | `dbo` | `tblAcctsBkup20260329160000` |
| 1389 | `dbo` | `tblAcctsBkup20260331220001` |
| 1390 | `dbo` | `tblAcctsBkup20260405160000` |
| 1391 | `dbo` | `tblAcctsBkup20260412160000` |
| 1392 | `dbo` | `tblAcctsBkup20260419160000` |
| 1393 | `dbo` | `tblAcctsBkup20260426160000` |
| 1394 | `dbo` | `tblAcctsBkup20260430220000` |
| 1395 | `dbo` | `tblAcctsBkup20260503160000` |
| 1396 | `dbo` | `tblAcctsBkup20260510160000` |
| 1397 | `dbo` | `tblAcctsBkup20260517160000` |
| 1398 | `dbo` | `tblAcctsBkup20260524160000` |
| 1399 | `dbo` | `tblAcctsBkup20260531160000` |
| 1400 | `dbo` | `tblAcctsBkup20260607160001` |
| 1401 | `dbo` | `tblAcctsBkup20260614160000` |
| 1402 | `dbo` | `tblAcctsBkup20260621160001` |
| 1403 | `dbo` | `tblAcctsBkup20260628160000` |
| 1404 | `dbo` | `tblAcctsBkup20260630220000` |
| 1405 | `dbo` | `tblAcctsBkup20260705160000` |
| 1406 | `dbo` | `tblAcctsBkup20260712160000` |
| 1407 | `dbo` | `tblAcctsBkup20260719160000` |
| 1408 | `dbo` | `tblAcctsBkup20260726160001` |
| 1409 | `dbo` | `tblAcctsBkup20260731220000` |
| 1410 | `dbo` | `tblAcctsBkup20260802160001` |
| 1411 | `dbo` | `tblAcctsBkup20260809160000` |
| 1412 | `dbo` | `tblAcctsBkup20260816160000` |
| 1413 | `dbo` | `tblAcctsBkup20260823160000` |
| 1414 | `dbo` | `tblAcctsBkup20260830160000` |
| 1415 | `dbo` | `tblAcctsBkup20260831220000` |
| 1416 | `dbo` | `tblAcctsBkup20260906160000` |
| 1417 | `dbo` | `tblAcctsBkup20260913160000` |
| 1418 | `dbo` | `tblAcctsBkup20260920160000` |
| 1419 | `dbo` | `tblAcctsNums` |
| 1420 | `dbo` | `tblAdmissionDischarge` |
| 1421 | `dbo` | `tblADSCaseAssigmentOrTermination` |
| 1422 | `dbo` | `tblAGE` |
| 1423 | `dbo` | `tblAMSpix` |
| 1424 | `dbo` | `tblAppoinmentSFInfo` |
| 1425 | `dbo` | `tblAPPT` |
| 1426 | `dbo` | `tblArea` |
| 1427 | `dbo` | `tblAssessmentRemoval` |
| 1428 | `dbo` | `tblASSIST` |
| 1429 | `dbo` | `tblAUDIT` |
| 1430 | `dbo` | `tblAuthRequestType` |
| 1431 | `dbo` | `tblAWS` |
| 1432 | `dbo` | `tblBACresult` |
| 1433 | `dbo` | `tblBEAKER` |
| 1434 | `dbo` | `tblBEAKERCOLOR` |
| 1435 | `dbo` | `tblBEDSETUP` |
| 1436 | `dbo` | `tblBHGNoticeOfPrivacyPractices` |
| 1437 | `dbo` | `tblBill` |
| 1438 | `dbo` | `tblBill_Adjustments_Backup_20260805` |
| 1439 | `dbo` | `tblBillActg` |
| 1440 | `dbo` | `tblBillBackupDeletedDeepak033125` |
| 1441 | `dbo` | `tblBillDay` |
| 1442 | `dbo` | `tblBillFIFO` |
| 1443 | `dbo` | `tblBillFifoBackup031124` |
| 1444 | `dbo` | `tblBillFIFOBackup070925` |
| 1445 | `dbo` | `tblBillFIFOBackupx052826` |
| 1446 | `dbo` | `tblBillFIFOBackupx121225` |
| 1447 | `dbo` | `tblBillPending` |
| 1448 | `dbo` | `tblBOTRECEPT` |
| 1449 | `dbo` | `tblbotrecept_History` |
| 1450 | `dbo` | `tblBottle` |
| 1451 | `dbo` | `tblBottlePowder` |
| 1452 | `dbo` | `tblBOTTLEPOWDERDETAIL` |
| 1453 | `dbo` | `tblCalomsInformation` |
| 1454 | `dbo` | `tblCHECKIN` |
| 1455 | `dbo` | `tblCHSAMSpix` |
| 1456 | `dbo` | `tblCityStateZipCode` |
| 1457 | `dbo` | `tblCLAIMDETAIL` |
| 1458 | `dbo` | `tblCLAIMS` |
| 1459 | `dbo` | `tblclaimstatus` |
| 1460 | `dbo` | `tblclaimstatus_AutoBilling` |
| 1461 | `dbo` | `tblClient` |
| 1462 | `dbo` | `tblClient_bak10252024` |
| 1463 | `dbo` | `TblClient_ForExport` |
| 1464 | `dbo` | `tblClientBkup20260313105323` |
| 1465 | `dbo` | `tblClientBkup20260401200000` |
| 1466 | `dbo` | `tblClientBkup20260501200000` |
| 1467 | `dbo` | `tblClientBkup20260601200000` |
| 1468 | `dbo` | `tblClientBkup20260701200000` |
| 1469 | `dbo` | `tblClientBkup20260801200000` |
| 1470 | `dbo` | `tblClientBkup20260901200000` |
| 1471 | `dbo` | `tblClientCOPY` |
| 1472 | `dbo` | `tblClientCustom` |
| 1473 | `dbo` | `tblClientCustomData` |
| 1474 | `dbo` | `tblClientDarts` |
| 1475 | `dbo` | `tblClientDartsCOPY` |
| 1476 | `dbo` | `tblClientDeleted` |
| 1477 | `dbo` | `tblClientDemo` |
| 1478 | `dbo` | `tblCLIENTFORMS` |
| 1479 | `dbo` | `tblClientGuest` |
| 1480 | `dbo` | `tblClientHx` |
| 1481 | `dbo` | `tblClientInfoRequiredFields` |
| 1482 | `dbo` | `tblCLIENTMED` |
| 1483 | `dbo` | `tblClientMEDCHECK` |
| 1484 | `dbo` | `tblClientMEDlog` |
| 1485 | `dbo` | `tblClientMedPillCount` |
| 1486 | `dbo` | `tblCLIENTMEDREFILL` |
| 1487 | `dbo` | `tblCLIENTMEDv4` |
| 1488 | `dbo` | `tblClientNOMS` |
| 1489 | `dbo` | `tblClientServiceRate` |
| 1490 | `dbo` | `tblClientServiceRateDefault` |
| 1491 | `dbo` | `tblClientSFInfo` |
| 1492 | `dbo` | `tblCLINIC` |
| 1493 | `dbo` | `tblclinicglobalNOT` |
| 1494 | `dbo` | `tblCLTID` |
| 1495 | `dbo` | `tblCODEADVANCEMENT` |
| 1496 | `dbo` | `tblCodes` |
| 1497 | `dbo` | `tblcodes_bak_10252024` |
| 1498 | `dbo` | `tblCOMPLIANCEClient` |
| 1499 | `dbo` | `tblConfigForms` |
| 1500 | `dbo` | `tblCONSENT` |
| 1501 | `dbo` | `tblCONSENTDETAIL` |
| 1502 | `dbo` | `tblConsentforReleaseConInfoRevoc` |
| 1503 | `dbo` | `tblCONSENTHEADER` |
| 1504 | `dbo` | `tblconsents` |
| 1505 | `dbo` | `tblConsentToDiscloseInfoMultipleRegistration` |
| 1506 | `dbo` | `tblConsentToPhoneCallsTextMessagesEmails` |
| 1507 | `dbo` | `tblControls` |
| 1508 | `dbo` | `tblCreditDetail` |
| 1509 | `dbo` | `tblCreditHeader` |
| 1510 | `dbo` | `tblCRIDPatient` |
| 1511 | `dbo` | `tblCurrentMedicationMAR` |
| 1512 | `dbo` | `tblCUSTOMANSWERS` |
| 1513 | `dbo` | `tblCustomOrderTemplate` |
| 1514 | `dbo` | `tblCUSTOMQUESTIONS` |
| 1515 | `dbo` | `tblCUSTOMQUESTIONS1` |
| 1516 | `dbo` | `tbld300` |
| 1517 | `dbo` | `tblDAANESNotification` |
| 1518 | `dbo` | `tblDartsCodes` |
| 1519 | `dbo` | `tblDartsDemogHistory` |
| 1520 | `dbo` | `tblDartsProvider` |
| 1521 | `dbo` | `tblDARTSREJECT` |
| 1522 | `dbo` | `tblDartsSrv` |
| 1523 | `dbo` | `tblDartsSrv_04222026` |
| 1524 | `dbo` | `tblDartsSrv_05042026` |
| 1525 | `dbo` | `tblDartsSrv_05082026` |
| 1526 | `dbo` | `tblDartsSrv_10thApril2025` |
| 1527 | `dbo` | `tblDartsSrv_10thFeb2026_Test` |
| 1528 | `dbo` | `tblDartsSrv_10thFeb2026_TestB` |
| 1529 | `dbo` | `tblDartsSrv_10thFeb2026_TestC` |
| 1530 | `dbo` | `tblDartsSrv_10thFeb2026_TestD` |
| 1531 | `dbo` | `tblDartsSrv_12thFeb2025` |
| 1532 | `dbo` | `tblDartsSrv_3rdApril2025` |
| 1533 | `dbo` | `TblDartssrv_export` |
| 1534 | `dbo` | `tblDartsSrvRevisions` |
| 1535 | `dbo` | `tblDartsSrvSubmit` |
| 1536 | `dbo` | `tblDartsSubmit` |
| 1537 | `dbo` | `tblDASA` |
| 1538 | `dbo` | `tblDefaultNotes` |
| 1539 | `dbo` | `tblDELI` |
| 1540 | `dbo` | `tblDETAILS` |
| 1541 | `dbo` | `tblDIAG` |
| 1542 | `dbo` | `tbldiag10` |
| 1543 | `dbo` | `tbldiag10_01212026` |
| 1544 | `dbo` | `tblDiagnosticAssessment` |
| 1545 | `dbo` | `tblDiagnosticAssessmentDiagnosis` |
| 1546 | `dbo` | `tblDischargeForm` |
| 1547 | `dbo` | `tblDischargeProgramdropdown` |
| 1548 | `dbo` | `tblDischargeReasondropdown` |
| 1549 | `dbo` | `tblDIVCALLCODES` |
| 1550 | `dbo` | `tblDivCallLog` |
| 1551 | `dbo` | `tblDiversionConsentLog` |
| 1552 | `dbo` | `tblDIVFREQ` |
| 1553 | `dbo` | `tblDIVFREQ01162025` |
| 1554 | `dbo` | `tblDIVSCHED` |
| 1555 | `dbo` | `tblDIVSCHED01172025` |
| 1556 | `dbo` | `tblDOCPAY` |
| 1557 | `dbo` | `tblDoctorsOrder` |
| 1558 | `dbo` | `tblDOSE` |
| 1559 | `dbo` | `tblDOSE_DATE_CHANGE` |
| 1560 | `dbo` | `tblDOSE_Excuse` |
| 1561 | `dbo` | `tblDOSECHARGE` |
| 1562 | `dbo` | `tblDosePre` |
| 1563 | `dbo` | `tblDosingWindows` |
| 1564 | `dbo` | `tblDRnote` |
| 1565 | `dbo` | `tbldrORDERS` |
| 1566 | `dbo` | `tbldrordertype` |
| 1567 | `dbo` | `tblDRUG` |
| 1568 | `dbo` | `tblDRUGRNP` |
| 1569 | `dbo` | `tblDSMIV` |
| 1570 | `dbo` | `tblduiChildren` |
| 1571 | `dbo` | `tblduiCustody` |
| 1572 | `dbo` | `tblduiDrug` |
| 1573 | `dbo` | `tblduiEncounter` |
| 1574 | `dbo` | `tblDUIINFO` |
| 1575 | `dbo` | `tblDUIINTAKE` |
| 1576 | `dbo` | `tblduiLegalStatus` |
| 1577 | `dbo` | `tblduiMedication` |
| 1578 | `dbo` | `tblduiMentalHealth` |
| 1579 | `dbo` | `tblduiSubsAbuse` |
| 1580 | `dbo` | `tblduiYesNo` |
| 1581 | `dbo` | `tblEDITS` |
| 1582 | `dbo` | `tblEKGReferralForm` |
| 1583 | `dbo` | `tblEmail` |
| 1584 | `dbo` | `tblEMDEON` |
| 1585 | `dbo` | `tblemdeonv5` |
| 1586 | `dbo` | `tblENROLL` |
| 1587 | `dbo` | `tblEnroll_bk06052025` |
| 1588 | `dbo` | `tblEnroll_bk06092025` |
| 1589 | `dbo` | `tblEnroll_bk06172025` |
| 1590 | `dbo` | `tblENROLLDeletedhistory` |
| 1591 | `dbo` | `tblENROLLhistory` |
| 1592 | `dbo` | `tblEnrollmentLog` |
| 1593 | `dbo` | `tblEnrollmentSFInfo` |
| 1594 | `dbo` | `tblEODParams` |
| 1595 | `dbo` | `tblFinancialAgreement` |
| 1596 | `dbo` | `tblFINGER` |
| 1597 | `dbo` | `tblFMP` |
| 1598 | `dbo` | `TblFormsContents` |
| 1599 | `dbo` | `tblGeneralConsentAuthClinic` |
| 1600 | `dbo` | `tblGENERALFORMS` |
| 1601 | `dbo` | `tblGOALS` |
| 1602 | `dbo` | `tblGRIDTEST` |
| 1603 | `dbo` | `tblGROUPLIST` |
| 1604 | `dbo` | `tblGROUPLISTDETAIL` |
| 1605 | `dbo` | `tblGroups` |
| 1606 | `dbo` | `tblHistory` |
| 1607 | `dbo` | `tblHOLD` |
| 1608 | `dbo` | `tblHold_bak20260618122511` |
| 1609 | `dbo` | `tblHold_bak20260715220334` |
| 1610 | `dbo` | `tblHold_bak20260815220414` |
| 1611 | `dbo` | `tblHold_bak20260901200024` |
| 1612 | `dbo` | `tblHold_bak20260915220220` |
| 1613 | `dbo` | `tblHoliday` |
| 1614 | `dbo` | `tblICDNine` |
| 1615 | `dbo` | `tblICDTen` |
| 1616 | `dbo` | `tblICDTen_04072026` |
| 1617 | `dbo` | `tblIDCARD` |
| 1618 | `dbo` | `tblIndividualForms` |
| 1619 | `dbo` | `tblINTAKEFORMS` |
| 1620 | `dbo` | `tblInterpretiveSummary` |
| 1621 | `dbo` | `tblINVASSOCIATION` |
| 1622 | `dbo` | `tblINVENTORYGROUP` |
| 1623 | `dbo` | `tblINVENTORYGROUPPREPACK` |
| 1624 | `dbo` | `tblINVENTORYPREPACK` |
| 1625 | `dbo` | `tblINVTYPE` |
| 1626 | `dbo` | `tblLabel` |
| 1627 | `dbo` | `tblLABELv5` |
| 1628 | `dbo` | `tblLABRESULT` |
| 1629 | `dbo` | `tblLABRESULTDETAIL` |
| 1630 | `dbo` | `tblLINEITEM` |
| 1631 | `dbo` | `tblLiquidLog` |
| 1632 | `dbo` | `tblLoginLog` |
| 1633 | `dbo` | `tblLookup` |
| 1634 | `dbo` | `tblLPHADiagnosticSummaryDetermination` |
| 1635 | `dbo` | `tblMAARC` |
| 1636 | `dbo` | `tblMapDrive` |
| 1637 | `dbo` | `tblMedicaid` |
| 1638 | `dbo` | `tblMEDS` |
| 1639 | `dbo` | `tblMEDV5` |
| 1640 | `dbo` | `tblMentalHealthProgressNote` |
| 1641 | `dbo` | `tblMentalHealthProgressNote_bak20241119` |
| 1642 | `dbo` | `tblMESSAGE` |
| 1643 | `dbo` | `tblMHBATCH` |
| 1644 | `dbo` | `tblMonthlyReportRecords` |
| 1645 | `dbo` | `tblMultipleRegistrationProgram` |
| 1646 | `dbo` | `tblMultipleRegistrationProgramIL` |
| 1647 | `dbo` | `tblMultipleRegistrationProgramMaint` |
| 1648 | `dbo` | `tblNOTE` |
| 1649 | `dbo` | `tblNOTIFICATIONS` |
| 1650 | `dbo` | `tblNotificationSchedule` |
| 1651 | `dbo` | `tblNursingAssessmentAllergy` |
| 1652 | `dbo` | `tblNursingAssessmentCurrentMedication` |
| 1653 | `dbo` | `tblNursingAssessmentSubstanceUseHistory` |
| 1654 | `dbo` | `tblNursingAssessmentVitals` |
| 1655 | `dbo` | `tblOBATOverride` |
| 1656 | `dbo` | `tblOPENINV` |
| 1657 | `dbo` | `tblOptumROI` |
| 1658 | `dbo` | `tblORDER` |
| 1659 | `dbo` | `tblOrderCustom` |
| 1660 | `dbo` | `tblORDERREQ` |
| 1661 | `dbo` | `tblORDERREQQuestions` |
| 1662 | `dbo` | `tblORDERREQQuestionsback` |
| 1663 | `dbo` | `tblOverlappingServices` |
| 1664 | `dbo` | `tblPasses` |
| 1665 | `dbo` | `tblPatientPhoneChangeLog` |
| 1666 | `dbo` | `tblPAYDOSE` |
| 1667 | `dbo` | `tblPAYERCLT` |
| 1668 | `dbo` | `tblPayerCltHistory` |
| 1669 | `dbo` | `tblPAYPERDOSE` |
| 1670 | `dbo` | `tblPAYPERMG` |
| 1671 | `dbo` | `tblPAYROEDIT` |
| 1672 | `dbo` | `tblPENDINGCLAIMS` |
| 1673 | `dbo` | `tblPharmLogDetail` |
| 1674 | `dbo` | `tblPharmLogHead` |
| 1675 | `dbo` | `tblPharmLogTransmit` |
| 1676 | `dbo` | `tblPhysResult` |
| 1677 | `dbo` | `tblPhysResultDetail` |
| 1678 | `dbo` | `tblPICS` |
| 1679 | `dbo` | `tblPowder` |
| 1680 | `dbo` | `tblPPMDOSE` |
| 1681 | `dbo` | `tblProblems` |
| 1682 | `dbo` | `tblPROCINFO` |
| 1683 | `dbo` | `tblProgram_Export` |
| 1684 | `dbo` | `tblProgramBilling` |
| 1685 | `dbo` | `tblProgramBillingIncome` |
| 1686 | `dbo` | `tblProgramMaintPatientInfo` |
| 1687 | `dbo` | `tblPROGSERV` |
| 1688 | `dbo` | `tblProtocolMAR` |
| 1689 | `dbo` | `tblPsychiastristEvalAllergy` |
| 1690 | `dbo` | `tblPsychiastristEvalCurrentMedication` |
| 1691 | `dbo` | `tblPsychiastristEvalFamilyHistory` |
| 1692 | `dbo` | `tblPsychiastristEvalPastMedication` |
| 1693 | `dbo` | `tblPsychiastristEvalSNAP` |
| 1694 | `dbo` | `tblPUMP` |
| 1695 | `dbo` | `tblPumpCalibrate` |
| 1696 | `dbo` | `tblQACCBYSResults` |
| 1697 | `dbo` | `tblQAQUESTIONS` |
| 1698 | `dbo` | `tblQAResults` |
| 1699 | `dbo` | `tblQNAdetail` |
| 1700 | `dbo` | `tblQNAhead` |
| 1701 | `dbo` | `tblQualityAssuranceDetails` |
| 1702 | `dbo` | `tblQualityAssuranceSet` |
| 1703 | `dbo` | `tblReceiptNum` |
| 1704 | `dbo` | `tblReceivingPrograms` |
| 1705 | `dbo` | `tblReferralAgencies` |
| 1706 | `dbo` | `tblReferralClinics` |
| 1707 | `dbo` | `tblRelationship` |
| 1708 | `dbo` | `tblreports` |
| 1709 | `dbo` | `tblREQUIREDINTAKEFIELDS` |
| 1710 | `dbo` | `tblResidential` |
| 1711 | `dbo` | `tblReviewFrequency` |
| 1712 | `dbo` | `tblRULES` |
| 1713 | `dbo` | `tblRUN` |
| 1714 | `dbo` | `tblSCALE` |
| 1715 | `dbo` | `tblSCAN` |
| 1716 | `dbo` | `tblSched` |
| 1717 | `dbo` | `tblSCHEDUSER` |
| 1718 | `dbo` | `tblSCHEDv5` |
| 1719 | `dbo` | `tblScxClientSigContainer` |
| 1720 | `dbo` | `tblSERVCOST` |
| 1721 | `dbo` | `tblSERVICES` |
| 1722 | `dbo` | `tblservices_bak_03172025` |
| 1723 | `dbo` | `tblservices_bak_10032024` |
| 1724 | `dbo` | `tblservices_bak_10252024` |
| 1725 | `dbo` | `tblSERVICES_Bak06052025` |
| 1726 | `dbo` | `tblServiceStatusLog` |
| 1727 | `dbo` | `tblSERVTPLINK` |
| 1728 | `dbo` | `TblSettings` |
| 1729 | `dbo` | `tblsettings_bak_01142026` |
| 1730 | `dbo` | `tblsettings_bak_09022026` |
| 1731 | `dbo` | `tblsettings_bak_10252024` |
| 1732 | `dbo` | `tblSHAREPOINT` |
| 1733 | `dbo` | `tblSITES` |
| 1734 | `dbo` | `tblSNAPNotes` |
| 1735 | `dbo` | `tblSpecialPops` |
| 1736 | `dbo` | `tblSplitNameForUnmappedTblUAResult` |
| 1737 | `dbo` | `tblStagesofchanges` |
| 1738 | `dbo` | `tblStatusArea` |
| 1739 | `dbo` | `tblTBResult` |
| 1740 | `dbo` | `tblTBResultDetail` |
| 1741 | `dbo` | `tbltempUNBILLED` |
| 1742 | `dbo` | `tblTESTINGRULES` |
| 1743 | `dbo` | `tblTOXPANEL` |
| 1744 | `dbo` | `tblTOXPANEL_bak10252024` |
| 1745 | `dbo` | `tblTP_DSM` |
| 1746 | `dbo` | `tbltp17GOAL` |
| 1747 | `dbo` | `tbltp17GOALREVIEW` |
| 1748 | `dbo` | `tbltp17INT` |
| 1749 | `dbo` | `tblTP17OBJ` |
| 1750 | `dbo` | `tblTP17REVIEW` |
| 1751 | `dbo` | `tblTP17Snap` |
| 1752 | `dbo` | `tbltp17Status` |
| 1753 | `dbo` | `tblTPDDLitems` |
| 1754 | `dbo` | `tblTPDETAIL` |
| 1755 | `dbo` | `tblTPDetailObj` |
| 1756 | `dbo` | `tblTPdischarge` |
| 1757 | `dbo` | `tblTPHEAD` |
| 1758 | `dbo` | `tblTPHEAD_Comments` |
| 1759 | `dbo` | `tblTPHEAD_Reviews` |
| 1760 | `dbo` | `tblTransitionPlan` |
| 1761 | `dbo` | `tblTRANSMIT` |
| 1762 | `dbo` | `tblTREATMENTCENTER` |
| 1763 | `dbo` | `tblTreatmentLevel` |
| 1764 | `dbo` | `tblTreatmentPlanLog` |
| 1765 | `dbo` | `tblTrtPlan` |
| 1766 | `dbo` | `tblTrtPlanCodes` |
| 1767 | `dbo` | `tblTrtPlanCodesGroups` |
| 1768 | `dbo` | `tblTrtPlanDim` |
| 1769 | `dbo` | `tblTrtPlanRev` |
| 1770 | `dbo` | `tblUAmanifest` |
| 1771 | `dbo` | `tblUAprogvars` |
| 1772 | `dbo` | `tbluaprogvars_bak10252024` |
| 1773 | `dbo` | `tblUAResult` |
| 1774 | `dbo` | `TblUAResult_export` |
| 1775 | `dbo` | `tblUAResultDetail` |
| 1776 | `dbo` | `tblUAResultDetail_16thJan2024` |
| 1777 | `dbo` | `tblUAResultDetail_Conversion` |
| 1778 | `dbo` | `tblUASched` |
| 1779 | `dbo` | `tblUASched_export` |
| 1780 | `dbo` | `tblUASched_HL7` |
| 1781 | `dbo` | `tblUASched_org` |
| 1782 | `dbo` | `tblUASched-org-5thFeb2024B` |
| 1783 | `dbo` | `tblUAschedPanel` |
| 1784 | `dbo` | `tblUASchedTests` |
| 1785 | `dbo` | `tblUASchedTests_HL7` |
| 1786 | `dbo` | `tblUATemp` |
| 1787 | `dbo` | `tblUAtests` |
| 1788 | `dbo` | `tblUAtestsPanels` |
| 1789 | `dbo` | `tblUAtestsSetup` |
| 1790 | `dbo` | `tblUAToxResultNotification` |
| 1791 | `dbo` | `tblUAToxResultNotificationDetail` |
| 1792 | `dbo` | `tblUAtype` |
| 1793 | `dbo` | `tblUPDATES` |
| 1794 | `dbo` | `tblUserGroups` |
| 1795 | `dbo` | `tblUserNOT` |
| 1796 | `dbo` | `tblUSERSEC` |
| 1797 | `dbo` | `tblUSERTEMPLATE` |
| 1798 | `dbo` | `tblUSERTEMPLATERIGHTS` |
| 1799 | `dbo` | `tblUserV4old` |
| 1800 | `dbo` | `tblVitals` |
| 1801 | `dbo` | `tblWhodas2` |
| 1802 | `dbo` | `tblWTC` |
| 1803 | `dbo` | `tblWTC1` |
| 1804 | `dbo` | `tblWTC2` |
| 1805 | `dbo` | `tblWTC3` |
| 1806 | `dbo` | `tblWTC4` |
| 1807 | `dbo` | `tblWTC5` |
| 1808 | `dbo` | `tblWTC6` |
| 1809 | `dbo` | `tblWTCIntake` |
| 1810 | `dbo` | `TBScreening` |
| 1811 | `dbo` | `TCMITPDiagnosis` |
| 1812 | `dbo` | `TCMITPForm` |
| 1813 | `dbo` | `TCMNeedsAssessment` |
| 1814 | `dbo` | `TCMOptIn` |
| 1815 | `dbo` | `TCUDrugScreen` |
| 1816 | `dbo` | `TEDSSubmissionForm` |
| 1817 | `dbo` | `tempICD` |
| 1818 | `dbo` | `tempmissed` |
| 1819 | `dbo` | `TNOBOTHighDose` |
| 1820 | `dbo` | `TNPatientEducationForm` |
| 1821 | `dbo` | `toximport` |
| 1822 | `dbo` | `TrackingTool` |
| 1823 | `dbo` | `TransactionKEY` |
| 1824 | `dbo` | `TransactionLookUpTable` |
| 1825 | `dbo` | `TransactionOBR` |
| 1826 | `dbo` | `TransactionOBX` |
| 1827 | `dbo` | `Transactions` |
| 1828 | `dbo` | `TransitionandDischargePlan` |
| 1829 | `dbo` | `TransitionandDischargePlanDiagnosis` |
| 1830 | `dbo` | `TransitionandDischargePlanSNAP` |
| 1831 | `dbo` | `TravelNotificationLetterTurk` |
| 1832 | `dbo` | `TravelNotificationLetterTurkProhibitionofRedisclosure` |
| 1833 | `dbo` | `treatmentcenter` |
| 1834 | `dbo` | `TreatmentContract` |
| 1835 | `dbo` | `TreatmentEpisode` |
| 1836 | `dbo` | `TreatmentFormAlertMappings` |
| 1837 | `dbo` | `TreatmentFormAlertMappings_01162026` |
| 1838 | `dbo` | `TreatmentFormAlertMappings_10042024` |
| 1839 | `dbo` | `TreatmentFormAlertMappings_12152025` |
| 1840 | `dbo` | `treatmentformalerts_bak_10252024` |
| 1841 | `dbo` | `TreatmentPlanSNAP` |
| 1842 | `dbo` | `TreatmentServicesReview` |
| 1843 | `dbo` | `TreatmentServicesReviewCurrentMedication` |
| 1844 | `dbo` | `TuberculosisRiskScreeningQuestionnaire` |
| 1845 | `dbo` | `TuberCulosisScreening` |
| 1846 | `dbo` | `type` |
| 1847 | `dbo` | `UpdateLogs` |
| 1848 | `dbo` | `UrineDrugScreenResult` |
| 1849 | `dbo` | `UrineDrugScreenResultsForOBOT` |
| 1850 | `dbo` | `UrineDrugScreenResultsForOTPProvider` |
| 1851 | `dbo` | `UserLogins` |
| 1852 | `dbo` | `ut_Change_Tracking_Version` |
| 1853 | `dbo` | `VAComprehensiveAssessment` |
| 1854 | `dbo` | `VAComprehensiveAssessmentAllergy` |
| 1855 | `dbo` | `VAComprehensiveAssessmentDimensionFiveMentalStatusExam` |
| 1856 | `dbo` | `VAComprehensiveAssessmentDimensionFiveSubstanceUse` |
| 1857 | `dbo` | `VAComprehensiveAssessmentDimensionOneDetail` |
| 1858 | `dbo` | `VAComprehensiveAssessmentDimensionOneDisorder` |
| 1859 | `dbo` | `VAComprehensiveAssessmentDimensionOneSubstanceUseHistory` |
| 1860 | `dbo` | `VAComprehensiveAssessmentDimentionFour` |
| 1861 | `dbo` | `VAComprehensiveAssessmentDimentionSix` |
| 1862 | `dbo` | `VAComprehensiveAssessmentDimentionThree` |
| 1863 | `dbo` | `VAComprehensiveAssessmentDimentionTwo` |
| 1864 | `dbo` | `VAComprehensiveAssessmentEducationalHistory` |
| 1865 | `dbo` | `VAComprehensiveAssessmentFamilyHistory` |
| 1866 | `dbo` | `VAComprehensiveAssessmentLastSummary` |
| 1867 | `dbo` | `VAComprehensiveAssessmentLegalHistory` |
| 1868 | `dbo` | `VAComprehensiveAssessmentMedication` |
| 1869 | `dbo` | `VAComprehensiveAssessmentModifiedMINIScreen` |
| 1870 | `dbo` | `VAComprehensiveAssessmentOccupationalHistory` |
| 1871 | `dbo` | `VAComprehensiveAssessmentPersonalHistory` |
| 1872 | `dbo` | `VAComprehensiveAssessmentPractitioners` |
| 1873 | `dbo` | `VAComprehensiveAssessmentSexualHistory` |
| 1874 | `dbo` | `VAComprehensiveAssessmentSocialHistory` |
| 1875 | `dbo` | `VAComprehensiveAssessmentSubstanceUseHistory` |
| 1876 | `dbo` | `VAComprehensiveAssessmentSummary` |
| 1877 | `dbo` | `VAComprehensiveAssessmentTraumaHistory` |
| 1878 | `dbo` | `VAComprehensiveAssessmentTreatmentHistory` |
| 1879 | `dbo` | `VAComprehensiveAssessmentVeteranStatus` |
| 1880 | `dbo` | `VAPeerRecoveryWellnessPlan` |
| 1881 | `dbo` | `Versions` |
| 1882 | `dbo` | `VOBEligibility` |
| 1883 | `dbo` | `VoidForm` |
| 1884 | `dbo` | `VoterPreferenceForm` |
| 1885 | `dbo` | `vw3pauthtemptable` |
| 1886 | `dbo` | `WAMAforPregnantPatients` |
| 1887 | `dbo` | `WeaponsPolicy` |
| 1888 | `dbo` | `WeCare_PriorMentalHealthTreatment` |
| 1889 | `dbo` | `WeCare_PriorSubstanceAbuse` |
| 1890 | `dbo` | `WeCare_RelapsePriorMentalHealthTreatment` |
| 1891 | `dbo` | `WeCare_RelapsePriorSubstanceUse` |
| 1892 | `dbo` | `whitefield` |
| 1893 | `dbo` | `xtemp` |
| 1894 | `dbo` | `YoloCountyIntake` |
| 1895 | `dbo` | `ZingDoseQueue` |
| 1896 | `dbo` | `ZingDoseQueueDetail` |
| 1897 | `rcm` | `tblClaimTag` |
| 1898 | `rcm` | `tblClaimTagTpc` |
| 1899 | `rcm` | `TblEncounterActions` |
| 1900 | `rcm` | `tblMRLogs` |
| 1901 | `rcm` | `tblVoidRevertHx` |
| 1902 | `scx` | `FormDataInfo` |
| 1903 | `scx` | `FormMapping` |
| 1904 | `scx` | `Notification` |
| 1905 | `scx` | `ScxMobileBanner` |
| 1906 | `scx` | `tblRestrictForms` |

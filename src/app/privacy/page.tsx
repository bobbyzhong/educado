import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col font-outfit w-full">
            <div className="flex  flex-col justify-center items-start bg-green3">
                <div className="TEXT-SECTION font-outfit flex flex-col text-left items-start mt-[12%] md:mt-[6%] pl-10 lg:pl-20">
                    <h1 className="md:text-5xl text-3xl font-semibold tracking-tight w-full ">
                        Privacy Policy
                    </h1>
                    <div className="md:text-[16px] text-[14px] leading-snug md:my-6 my-4  text-zinc-700">
                        Last Updated: November 17, 2023
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col mx-10 md:mx-20 mt-10 w-9/12 lg:w-6/12">
                    <div>
                        <h1 className="text-3xl font-medium ">Introduction</h1>
                        <div className="text-[16px] ">
                            <div className="mt-5">
                                Educado's mission is to help teachers and
                                schools give their students the personalized
                                support and help they need anytime anywhere. We
                                are a small team and are looking to build long
                                lasting and meaningful relationships with the
                                districts/schools/teachers that we work with and
                                earning your trust by ensuring your privacy and
                                safety is therefore extremely important to us.
                            </div>
                            <div className="mt-3">
                                This Privacy Policy ("Privacy Policy" or the
                                "Policy") explains:
                                <ul className="ml-10 mt-2 flex flex-col gap-3">
                                    <li>
                                        - What information Educado collects from
                                        you, why we collect it and on which
                                        legal grounds such collection is based
                                    </li>
                                    <li>
                                        - How we use and with whom we share that
                                        information.
                                    </li>
                                    <li>
                                        - The choices you have, including how to
                                        access, update, delete and, where
                                        applicable, retrieve your information
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-3">
                                This Policy applies to all products and services
                                offered by Educado, Inc. (hereinafter referred
                                to as “Educado,” “we,” “us," “our,” also
                                including our subsidiaries or affiliates). We
                                have done our best to write it in simple, clear
                                terms, and we encourage you to read it
                                carefully, together with any other privacy
                                notice we may provide on specific occasions when
                                we are collecting or processing personal
                                information about you, so that you are aware of
                                how and why we are using such information.
                            </div>
                            <div className="mt-3">
                                We are compliant with FERPA, COPPA, and more
                                policies you can find below. We strive to be as
                                transparent as possible and if you have any
                                questions, please feel free to reach out to us
                                at anytime.
                            </div>
                        </div>
                    </div>
                    {/* PRINCIPALS */}
                    <div>
                        <h1 className="text-3xl font-medium mt-10">
                            Our Privacy Principles
                        </h1>
                        <div className="text-[16px] ">
                            <div className="mt-3">
                                In collecting and processing your personal
                                information, we will comply with the data
                                protection laws and regulations in force at the
                                time. This requires that the personal
                                information we hold about you must be:
                                <ul className="ml-10 mt-2 flex flex-col gap-3">
                                    <li>
                                        - Used lawfully, fairly and in a
                                        transparent way.
                                    </li>
                                    <li>
                                        - Collected only for valid purposes that
                                        we have clearly explained to you and not
                                        used in a way that is incompatible with
                                        those purposes.
                                    </li>
                                    <li>
                                        - Relevant to the purposes we have told
                                        you about and limited only to those
                                        purposes.
                                    </li>
                                    <li>- Accurate and kept up-to-date.</li>
                                    <li>
                                        - Kept only as long as necessary for the
                                        purposes we have told you about.
                                    </li>
                                    <li>- Kept securely.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* HOW WE USE DATA */}

                    <div>
                        <h1 className="text-3xl font-medium mt-10">
                            What Information We Collect and How We Use It
                        </h1>
                        <div className="text-[16px] ">
                            <div className="mt-3">
                                First and foremost, you should know that Educado
                                does not sell or rent any of your, or your
                                students' personal information to any third
                                party for any purpose, including for advertising
                                or marketing purposes. We use the information we
                                collect from you to provide the Service and
                                offer the best Educado experience possible.
                                Concretely, the personal information of students
                                and teachers is collected and used for the
                                following purposes:
                                <ul className="ml-10 mt-2 flex flex-col gap-3">
                                    <li>
                                        - To provide teachers with analytics on
                                        student progress
                                    </li>
                                    <li>
                                        - To allow teachers/admin to monitor
                                        student's activity
                                    </li>
                                    <li>
                                        - To allow students to reconnect with
                                        tutors they've recently worked with
                                    </li>
                                    <li>
                                        - To notify teachers of any
                                        inappropriate or concerning actions
                                    </li>
                                    <li>
                                        - To allow sudents to go back and review
                                        their conversations with tutors
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-3">
                                Authorization is given to Educado and its
                                processors to collect, process and otherwise
                                handle Personal Information under this Privacy
                                Policy and the Educado Terms and Conditions when
                                an Educator Educado User or Institution
                                purchases the Educado Materials, as well as when
                                an Educator Educado User establishes an end-user
                                account and registers to use the Educado
                                Materials. Further authorization is given to
                                collect, process, and otherwise handle Personal
                                Information of a Student Educado User under this
                                Privacy Policy and the Terms and Conditions when
                                an Educator generates an access code through use
                                of the Educado Materials and provides the access
                                code to a Student Educado User or when an
                                Institution elects to opt in to Student
                                Accounts. Educator Educado Users and their
                                Institutions are responsible to obtain any
                                additional legally required consents for Student
                                Educado Users.
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-medium mt-10">
                            What are your rights when using Educado?
                        </h1>
                        <div className="text-[16px] ">
                            <div className="mt-3">
                                Your rights relating to your personal
                                information include:
                                <ul className="ml-10 mt-2 flex flex-col gap-3">
                                    <li>
                                        - to be informed about how Educado uses
                                        your personal information;
                                    </li>
                                    <li>
                                        - to request access to personal
                                        information held by Educado, and to have
                                        any incorrect, inaccurate or incomplete
                                        personal information rectified;
                                    </li>
                                    <li>
                                        - where appropriate, to restrict
                                        processing concerning you or to object
                                        to processing;
                                    </li>
                                    <li>
                                        - to have personal information erased
                                        where there is no compelling reason for
                                        its continued processing; and
                                    </li>
                                    <li>
                                        - where applicable, to portability of
                                        personal data, that is to say, to
                                        receive your personal information in a
                                        structured and commonly used format.
                                    </li>
                                    <li>- Remove information from Educado.</li>
                                    <li>
                                        - Retrieve information from Educado, if
                                        applicable.
                                    </li>
                                    <li>
                                        - Opt-out of providing certain
                                        information.
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-3">
                                We will only use your personal information for
                                the purposes for which we collected it, unless
                                we reasonably consider that we need to use it
                                for another reason which is compatible with the
                                original purpose. If we need to use your
                                personal information for an unrelated purpose,
                                we will notify you and we will explain the legal
                                basis which allows us to do so. When, as a
                                teacher or school representative, or when acting
                                on behalf of a company or other organization,
                                you create an Educado account (via Google Auth),
                                you provide your first and last name and an
                                email address. We require those data elements
                                for you to enter into the Terms of Service
                                agreement with us, and we process those elements
                                on the basis of performing that contract.
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-medium mt-10">
                            Compliance with Privacy Laws:
                        </h1>
                        <div className="text-[16px] ">
                            <div className="mt-10">
                                <b className="text-lg">FERPA:</b>
                                <div className="mt-5">
                                    Educado and the Educado Materials comply
                                    with and are designed to allow responsible
                                    parties to comply with applicable law,
                                    including the Family Educational Rights and
                                    Privacy Act (FERPA), 20 U.S.C. 1232g, 34 CFR
                                    Part 99 (FERPA) in receiving and handling
                                    personally identifiable information from
                                    education records as a "school official"
                                    under FERPA.
                                </div>
                            </div>
                            <div className="mt-10">
                                <b className="text-lg">COPPA:</b>
                                <div className="mt-5">
                                    Educado relies on the Institution’s consent
                                    in lieu of a parent in collecting verifiable
                                    consent of students under the age of 13.
                                </div>
                            </div>
                            <div className="mt-10">
                                <b className="text-lg">California AB 1584:</b>
                                <div className="mt-5">
                                    Regarding California AB 1584 (Buchanan)
                                    Privacy of Pupil Records: 3rd-Party Digital
                                    Storage & Education Software (Education Code
                                    section 49073.1), Educado will adhere to the
                                    following:
                                    <ul className="ml-10 mt-2 flex flex-col gap-3">
                                        <li>
                                            - Student records obtained by
                                            Educado from an educational
                                            institution continue to be the
                                            property of and under the control of
                                            the educational institution. The
                                            educational institution retains full
                                            ownership rights of the personal
                                            information and education records it
                                            provides to Educado.
                                        </li>
                                        <li>
                                            - Educado users may retain
                                            possession and control of their own
                                            generated content by signing into
                                            and accessing their Educado account
                                            and deleting, where applicable,
                                            modifying or updating their
                                            information within Educado. Students
                                            have access to and control of their
                                            own information and
                                            student-generated content subject to
                                            the limitations imposed by the
                                            student’s teacher.
                                        </li>
                                        <li>
                                            - Educado will not use any
                                            information in a student record for
                                            any purpose other than those
                                            required or specifically permitted
                                            by Educado’s Terms of Service and
                                            Privacy Policy.
                                        </li>
                                        <li>
                                            - Parents, legal guardians, or
                                            eligible students may review
                                            personally identifiable information
                                            in the student’s records and correct
                                            erroneous information by contacting
                                            their educational institution.
                                            Additionally, Educado users may
                                            access, correct, update, or delete
                                            personal information in their
                                            profile by signing into Educado,
                                            accessing their Educado account, and
                                            making the appropriate changes.
                                        </li>
                                        <li>
                                            - Educado is committed to
                                            maintaining the security and
                                            confidentiality of student records.
                                            Towards this end, we take the
                                            following actions: (a) we limit
                                            employee access to student data to
                                            only those employees with a need to
                                            such access to fulfill their job
                                            responsibilities; (b) we conduct
                                            background checks on our employees
                                            that may have access to student
                                            data; (c) we conduct regular
                                            employee privacy and data security
                                            training and education; and (d) we
                                            protect personal information with
                                            technical, contractual,
                                            administrative, and physical
                                            security safeguards in order to
                                            protect against unauthorized access,
                                            release or use.
                                        </li>
                                        <li>
                                            - In the event of an unauthorized
                                            disclosure of a student’s records,
                                            Educado will promptly notify users
                                            unless specifically directed not to
                                            provide such notification by law
                                            enforcement officials. Notification
                                            shall identify: (i) the date and
                                            nature of the unauthorized use or
                                            disclosure; (ii) the private data
                                            used or disclosed; (iii) a general
                                            description of what occurred
                                            including who made the unauthorized
                                            use or received the unauthorized
                                            disclosure; (iv) what Educado has
                                            done or shall do to mitigate any
                                            effect of the unauthorized use or
                                            disclosure; (v) what corrective
                                            action Educado has taken or shall
                                            take to prevent future similar
                                            unauthorized use or disclosure; and
                                            (vi) who at Educado the user can
                                            contact. Educado will keep the User
                                            fully informed until the incident is
                                            resolved.
                                        </li>
                                        <li>
                                            - Educado will delete or de-identify
                                            personal information when it is no
                                            longer needed, upon expiration or
                                            termination of our agreement with an
                                            educational institution with any
                                            deletion or de-identification to be
                                            completed according to the terms of
                                            our agreement with the educational
                                            institution, or at the direction or
                                            request of the educational
                                            institution.
                                        </li>
                                        <li>
                                            - Educado agrees to work with
                                            educational institutions to ensure
                                            compliance with FERPA and the
                                            Parties will ensure compliance by
                                            providing parents, legal guardians
                                            or eligible students with the
                                            ability to inspect and review
                                            student records and to correct any
                                            inaccuracies therein as described in
                                            statement (4) above.
                                        </li>
                                        <li>
                                            - Educado prohibits using personally
                                            identifiable information in student
                                            records to engage in targeted
                                            advertising.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-10">
                                <b className="text-lg">
                                    U.S. Educational Institutions and Parental
                                    Consent:
                                </b>

                                <div className="mt-5">
                                    If you or your school decide to utilize the
                                    Service with students under the age of
                                    thirteen (13), COPPA requires to either
                                    obtain parental consent or for the school to
                                    consent on behalf of the children's parents,
                                    which is commonly referred to as "School
                                    Consent." At the same time, yet subject to
                                    exceptions, FERPA prohibits schools from
                                    disclosing personally identifiable
                                    information from a student's education
                                    record to a third party without written
                                    consent from the parent or eligible student.
                                    Typically, schools are exempted from
                                    obtaining parental consent under FERPA when
                                    Educado is identified as a "school
                                    official," meaning Educado is performing an
                                    institutional service or function for which
                                    the school would otherwise use its own
                                    employees. Educado complies with both COPPA
                                    and FERPA regulations when it comes to
                                    parental consent required to utilize the
                                    Service in an educational context. Please
                                    note, however, that the previous statements
                                    do not constitute legal advice, and we
                                    recommend you seek guidance from the
                                    school’s designated legal counsel if you
                                    have any concerns or inquiries regarding
                                    compliance with COPPA, FERPA, and other
                                    applicable privacy regulations.
                                </div>
                            </div>
                            <div className="mt-10">
                                <b className="text-lg">
                                    European Educational Institutions and GDPR:
                                </b>

                                <div className="mt-5">
                                    According to article 8 of the GDPR, minors
                                    shall be entitled to give valid consent only
                                    if they are 16 years old or older (unless
                                    Member States have set a lower age limit
                                    which, nonetheless, cannot be under 13 years
                                    old). Under that age limit, processing of
                                    personal information related to minors shall
                                    be subject to parental consent when consent
                                    is the lawful basis to process children’s
                                    education data. Schools are in control of
                                    their students’ personal information and are
                                    obliged to take all necessary measures for
                                    protecting said information. In terms of the
                                    GDPR, schools are data controllers and thus
                                    determine the purposes and means of the
                                    processing of student personal data. As a
                                    consequence, and as per GDPR/UK GDPR
                                    regulations, European educational
                                    institutions must inform students and their
                                    parents accordingly about what personal data
                                    is processed, the lawful basis for
                                    processing, which are the purposes of
                                    collection, how data is used, and to which
                                    third parties it is disclosed, including
                                    Educado. Please note, however, that the
                                    previous statements do not constitute legal
                                    advice, and we recommend you seek guidance
                                    from the school’s designated Data Protection
                                    Officer/legal counsel if you have any
                                    concerns or inquiries regarding compliance
                                    with GDPR/UK GDPR and/or other applicable
                                    regulations.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-20">
                        <h1 className="text-3xl font-medium mt-10">
                            Additional Information or Help
                        </h1>
                        <div className="text-[16px] ">
                            <div className="mt-3">
                                You can contact us for additional information or
                                help at{" "}
                                <Link
                                    href={"mailto:bobby@tryeducado.com"}
                                    className="text-green underline"
                                >
                                    bobby@tryeducado.com
                                </Link>{" "}
                                or by regular mail to the following address:
                            </div>
                            <div className="mt-3">
                                5550 W Cerritos Ave Unit G, Cypress, CA 90630
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 lg:ml-0 ml-10 mb-20">
                    <h1 className="text-5xl font-bold text-green text-opacity-[0.39]">
                        Contact Us
                    </h1>
                    <p className="text-gray-400 font-medium tracking-tight w-10/12 mb-2 mt-1">
                        Feel free to reach out to us at anytime if you have any
                        questions about our privacy policy!
                    </p>
                    <div className="text-2xl font-[500] flex flex-col gap-1">
                        <Link
                            href={"mailto:bobby@tryeducado.com"}
                            className="hover:cursor-pointer"
                        >
                            bobby@tryeducado.com
                        </Link>
                        <Link
                            href={"tel:7143309387"}
                            className="hover:cursor-pointer"
                        >
                            (714) 330-9387
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

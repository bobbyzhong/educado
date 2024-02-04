import { TutorCard } from "./TutorCard";

const TutorSearchList = ({
    filterdFigures,
    userId,
}: {
    filterdFigures: any;
    userId: string;
}) => {
    return (
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
            {filterdFigures.map((tutor: any, i: any) => {
                return (
                    <div key={i}>
                        <TutorCard
                            name={tutor.tutorDisplayName}
                            id={tutor.id}
                            description={tutor.tutorDescription!}
                            joinCode={tutor.joinCode!}
                            grade={tutor.grade}
                            subject={tutor.subject}
                            userId={userId}
                        />
                    </div>
                );
            })}
        </div>
    );
};
export default TutorSearchList;

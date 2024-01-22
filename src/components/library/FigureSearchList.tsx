import { LibraryCard } from "../LibraryCard";
import { TutorCard } from "../tutor/TutorCard";

const FigureSearchList = ({ filterdFigures }: { filterdFigures: any }) => {
    return (
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
            {filterdFigures.map((tutor: any, i: any) => {
                return (
                    <div key={i}>
                        <LibraryCard
                            name={tutor.tutorDisplayName}
                            id={tutor.id}
                            description={tutor.tutorDescription!}
                            joinCode={tutor.joinCode!}
                            owner={tutor.ownerName!}
                        />
                    </div>
                );
            })}
        </div>
    );
};
export default FigureSearchList;

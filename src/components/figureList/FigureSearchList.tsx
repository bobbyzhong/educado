import { FigureCard } from "./FigureCard";

const FigureSearchlist = ({ filterdFigures }: { filterdFigures: any }) => {
    return (
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
            {filterdFigures.map((tutor: any, i: any) => {
                return (
                    <div key={i}>
                        <FigureCard
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
export default FigureSearchlist;

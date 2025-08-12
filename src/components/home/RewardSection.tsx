export default function RewardSection() {
  return (
    <div className="w-full my-16 md:my-24 px-12 lg:px-56 text-black flex flex-wrap justify-between items-center">
      <div className="flex flex-col w-full lg:max-w-[35%] gap-2 items-center">
        <h2 className="text-navy text-[42px] font-alfa-slab-one font-black">
          STAKE $RWA & EARN REWARDS
        </h2>

        <p className="text-navy text-xl">
          Lock your $RWA tokens in the vaults to earn rewards paid out in $RWA
        </p>
      </div>

      <div className="w-full lg:max-w-[65%] flex flex-wrap items-center justify-center">
        <TotalStaked />
      </div>
    </div>
  );
}

const TotalStaked = () => {
  return <div className="bg-water px-6 py-10 rounded-4xl"></div>;
};

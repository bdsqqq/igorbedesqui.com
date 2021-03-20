export default function Iss() {
  const issMeta = useProjMeta("iss");
  return (
    <ProjectContainer key="issProj" backMessage="Jump right back">
      <HeroBand>
        <Trans
          i18nKey="projs/iss:something"
          components={[
            <span className="font-light text-sm sm:text-lg md:text-2xl" />,
            <br />,
            <span className="font-bold" />,
          ]}
        />
      </HeroBand>
      <DetailsBand projName={issMeta.name}>
        <div className="leading-loose mb-6">
          <h3 className="font-bold text-xl">Role</h3>
          <ul>
            {issMeta.roles.map((role, i) => {
              return (
                <li key={i}>
                  {role}
                  {i < issMeta.roles.length - 1 && ","}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="leading-loose mb-6">
          <h3 className="font-bold text-xl">Tools</h3>
          <ul>
            {issMeta.tools.map((tool, i) => {
              return (
                <li key={i}>
                  {tool}
                  {i < issMeta.tools.length - 1 && ","}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="leading-loose mb-6">
          <h3 className="font-bold text-xl">Date</h3>
          <p>June 2020</p>
          <h3 className="font-bold text-xl">Project type</h3>
          <p>Personal</p>
        </div>
      </DetailsBand>
      <Band
        dark
        headline={{ bold: "A", thin: "aa" }}
        cta={{ target: "/", text: "something" }}
      ></Band>
      <Band
        dark
        headline={{ bold: "A", thin: "aa" }}
        cta={{ target: "/", text: "something", outOfSite: true }}
      ></Band>
    </ProjectContainer>
  );
}

import Trans from "next-translate/Trans";

import ProjectContainer from "../../components/ProjectStuff/ProjectContainer";
import Band from "../../components/Band";
import HeroBand from "../../components/HeroBand";
import DetailsBand from "../../components/ProjectStuff/DetailsBand";

import useProjMeta from "../../hooks/useProjMeta";

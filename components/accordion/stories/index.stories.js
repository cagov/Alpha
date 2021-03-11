import { WebComponent, MultipleWebComponent } from "./storybook-web-component";
import { html } from "lit-html";

export default {
  title: "@cagov/Web components/accordion",
  argTypes: {
    // backgroundColor: { control: "color" },
    // onClick: { action: "onClick" },
    accordionLabel: { control: { type: "string" } },
    accordionContent: { control: { type: "string", disable: true } },
    accordions: { control: { type: "array", disable: true } },
    expanded: { control: { type: "boolean", disable: true } },
  },
  decorators: [],
};

const Template = (args) => WebComponent(args);

export const BasicAccordion = Template.bind({});
BasicAccordion.storyName = "Basic Accordion";
BasicAccordion.args = {
  label: "Basic Accordion",
  primary: true,
  expanded: false,
  label:
    "What are the similarities and differences between Influenza (flu) and COVID-19?",
  content: html`<p>
      Influenza (flu) and COVID-19 are both contagious respiratory illnesses,
      but they’re caused by different viruses. COVID-19 is caused by a
      <a href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html#Basics"
        >new coronavirus (called SARS-CoV-2)</a
      >
      and flu is caused by
      <a href="https://www.cdc.gov/flu/about/viruses/index.htm"
        >influenza viruses</a
      >.&nbsp;
    </p>
    <p>
      The symptoms of flu and COVID-19 are similar. It is hard to tell the
      difference between them without testing.
    </p>
    <p>
      Cases of COVID-19 and flu can have anything from no symptoms
      (asymptomatic) to severe symptoms. Common symptoms that COVID-19 and flu
      share include:
    </p>
    <ul>
      <li>Fever or chills</li>
      <li>Cough</li>
      <li>Shortness of breath or difficulty breathing</li>
      <li>Fatigue (tiredness)</li>
      <li>Sore throat</li>
      <li>Runny or stuffy nose</li>
      <li>Muscle pain or body aches</li>
      <li>Headache</li>
      <li>Vomiting and diarrhea (more common in children than adults)</li>
    </ul>
    <p>
      The major difference between them is COVID-19 may include change in or
      loss of taste or smell.
    </p>
    <p>
      The CDC has more information about
      <a href="https://www.cdc.gov/flu/symptoms/flu-vs-covid19.htm"
        >similarities and differences between the flu and COVID-19.</a
      >
    </p>`,
};

export const BasicAccordionOpen = Template.bind({});
BasicAccordionOpen.storyName = "Basic Accordion, open";
BasicAccordionOpen.args = {
  expanded: true,
  accordionLabel: "Open accordion",
  accordionContent: html`<p>Accordion content</p>`,
};


export const MultipleAccordions = MultipleWebComponent.bind({});
MultipleAccordions.storyName = "Three accordions, middle item open";
MultipleAccordions.args = {
  accordions: [
    {
      accordionLabel: "Accordion1 label",
      accordionContent: html`<p>Second generation vaccines were developed to reduce the risks from live vaccines. These are subunit vaccines, consisting of specific protein antigens (such as tetanus or diphtheria toxoid) or recombinant protein components (such as the hepatitis B surface antigen). They can generate TH and antibody responses, but not killer T cell responses.</p>

      <p>RNA vaccines and DNA vaccines are examples of third generation vaccines.mRNA vaccines such as BNT162b2 were developed in the year 2020 with the help of Operation Warp Speed and massively deployed to combat the coronavirus pandemic.</p>
      
      <p>Since at least 2013, scientists were trying to develop synthetic 3rd-generation vaccines by reconstructing the outside structure of a virus; it was hoped that this will help prevent vaccine resistance.</p><p><a href="https://www.boom-online.co.uk/lorem-ipsum/">Source Boom text generator</a></p>`,
      expanded: false,
    },
    {
      accordionLabel: "Accordion2 label",
      accordionContent: html`<p>The filing of patents on vaccine development processes can also be viewed as an obstacle to the development of new vaccines. Because of the weak protection offered through a patent on the final product, the protection of the innovation regarding vaccines is often made through the patent of processes used in the development of new vaccines as well as the protection of secrecy.</p>

      <p>Vaccine production has several stages. First, the antigen itself is generated. Viruses are grown either on primary cells such as chicken eggs (e.g., for influenza) or on continuous cell lines such as cultured human cells (e.g., for hepatitis A).</p>
      
      <p>The final stage in vaccine manufacture before distribution is fill and finish, which is the process of filling vials with vaccines and packaging them for distribution. Although this is a conceptually simple part of the vaccine manufacture process, it is often a bottleneck in the process of distributing and administering vaccines.</p><p><a href="https://www.boom-online.co.uk/lorem-ipsum/">Source Boom text generator</a></p>`,
      expanded: true,
    },
    {
      accordionLabel: "Accordion3 label",
      accordionContent: html`<p>International research on vaccines and medicines in COVID-19 is underway by government organisations, academic groups, and industry researchers.</p>

      <p>As of December 2020</p>
      
      <p>Repurposed antiviral drugs make up most of the research into COVID-19 treatments.</p><p><a href="https://www.boom-online.co.uk/lorem-ipsum/">Source Boom text generator</a></p>`,
      expanded: false,
    },
  ]
};

var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/i18n/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

// wtf.fetch('Croatian language').then(doc => {
//   console.log(doc.tables().map(t => t.json()))
//   // let html = doc.html()
//   // console.log(html)
// })

// wtf.fetchCategory('Larchmont, New York').then(res => {
//   res.docs.forEach(doc => {
//     console.log(doc.title())
//     console.log(doc.summary())
//     console.log('\n\n')
//   })
// })
// let str =
//   'Larchmont Yacht Club is a private, members-only yacht club situated on Larchmont Harbor in the Village of Larchmont, in Westchester County, New York. '
// console.log(wtf(str).summary())

// let file = 'United-Kingdom'
// let txt = require('fs')
//   .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//   .toString()
// let doc = wtf(txt)
// let res = doc.classify()
// console.log(res)
let str = `
[[Image:Max Planck Wirkungsquantums 20050815.jpg|thumb|right|A commemoration plaque for [[Max Planck]] on his discovery of Planck's constant, in front of [[Humboldt University]], [[Berlin]]. English translation: "Max Planck, discoverer of the elementary quantum of action ''h'', taught in this building from 1889 to 1928."]]
[[File:Max planck.jpg|thumb|right|175px|Max Planck, after whom the Planck constant is named]]

The '''Planck constant''' ('''Planck's constant''') links  the amount of [[energy]] a [[photon]] carries with the [[frequency]] of its [[electromagnetic wave]]. It is named after the physicist [[Max Planck]].  It is an important [[quantity]] in [[quantum physics]].

The Planck constant has [[dimensional analysis|dimensions]] of physical action: [[energy]] multiplied by [[time]], or [[momentum]] multiplied by [[distance]]. In [[International System of Units|SI units]], the Planck constant is expressed in [[joule]] seconds (J⋅s) or ([[Newton (unit)|N]]⋅[[metre|m]]⋅[[second|s]]) or ([[Kilogram|kg]]⋅m<sup>2</sup>⋅s<sup>&minus;1</sup>).
The symbols are defined [[#PlanckSymbolTable|here]].

In [[International System of Units|SI Units]] the Planck constant is about {{val|6.62606|e=-34}} [[joule|J]]·[[second|s]].<ref>{{citeweb|url=http://www.chem4kids.com/files/etcetera_constants.html|title=Chem4kids – Constants in Chemistry|accessdate=24.05.10}}</ref> Scientists have used this quantity to calculate measurements like the [[Planck length]] and the [[Planck time]].

==Background==
{| class="infobox" style="padding: 0; text-align: center; width: 0"
! colspan="2" style="background:#ccf;"|{{nowrap|Symbols used in this article.}}
|-
{{anchor|PlanckSymbolTable}}
{| style="border: 1px #aaa solid"
!style="background:#edf; text-align: center"|Symbol
!style="background:#edf; text-align: left"|Meaning
|-
|align="center"|E
|align="left"|[[Energy]]
|-
|align="center"|h
|align="left"|Planck constant
|-
|align="center"|k
|align="left"|[[Boltzmann constant]]
|-
|align="center"|c
|align="left"|[[speed of light]]
|-
|align="center"|λ
|align="left"|[[radiation]]&nbsp;[[wavelength]] 
|-
|align="center"|ν
|align="left"|radiation [[frequency]]
|-
|T
|align="left"|[[Absolute temperature|absolute&nbsp;temperature]]
|}
|}
[[File:NewtonDualPrismExperiment.jpg|thumb|200px|Illustration taken from Newton's original letter to the Royal Society (1 January 1671 [Julian calendar]).  S represents sunlight.  The light between the planes BC and DE are in colour. These colours are recombined to form sunlight on the plane GH]]
[[File:Two-Slit Experiment Light.svg|200px|thumb|Young's double slit experiment]]
Between 1670 and 1900 scientists discussed the nature of light. Some scientists believed that light consisted of many millions of tiny particles. Other scientists believed that light was a [[wave]].<ref>{{MacTutor|class=HistTopics|id=Light_1|title=Light through the ages: Ancient Greece to Maxwell}}</ref>

=== Light: waves or particles? ===
In 1678 [[Christiaan Huygens]] wrote the book ''Traité de la lumiere'' ("Treatise on light"). He believed that light was made up of waves. He said that light could not be made up of particles because light from two beams do not bounce off each other.<ref>{{MacTutor|id=Huygens|title=Christiaan Huygens}}</ref><ref name=Fitzpatrick>{{cite journal
|url = http://farside.ph.utexas.edu/teaching/302l/lectures/node148.html
|title = Wave Optics
|first1 = Richard
|last1 = Fitzpartick
|journal = Lecture notes
|date = 14 July 2007
|publisher = University of Texas
|accessdate = 13 February 2014}}</ref>
In 1672 [[Isaac Newton]] wrote the book ''Opticks''. He believed that light was made up of red, yellow and blue particles which he called corpusles. Newton explained this by his "two prism experiment". The first prism broke light up into different colours. The second prism merged these colours back into white light.<ref>{{cite web
|url = http://trailblazing.royalsociety.org/commentary.aspx?action=printCommentary&eventId=84
|title = Isaac Newton's theory on light and colours
|publisher = The Royal Society
|accessdate = 25 February 2014}}</ref><ref>{{cite journal
|url = http://rstl.royalsocietypublishing.org/content/6/69-80/3075
|journal = Philosophical Transactions
|volume = 6
|pages = 69-80
|date = 1 January 1671/2
|first1 = Isaac
|last1 = Newton}}</ref><ref>{{cite journal
|url = http://www.opticsjournal.com/F.J.DuarteOPN%282000%29.pdf
|title = Newton, Prisms, and the "Optiks" of Tunable Lasers
|first1 = FJ
|last1 = Duarte
|journal = Optics & Photonics News
|date = May 2000
|publisher = Optical Society of America
|pages = 24 - 28
|accessdate = 13 February 2014}}</ref>

During the 18th century Newton's theory was given the most attention.<ref>{{cite encyclopedia 
|year= 1771
|title = Optics
|encyclopedia= Encyclopeadia Britannica
|publisher= A Society of Gentlemen in Scotland
|location= Edinburgh}}</ref> In 1803 [[Thomas Young]] described the [[Young's interference experiment|"double-slit experiment"]].<ref name=Fitzpatrick/> In this experiment light from two narrow slits [[Interference|interfere]] with each other. This caused a pattern which showed that light was made up of waves. For the rest of the nineteenth century wave theory of light was given the most attention. In the 1860s [[James Clerk Maxwell]] developed [[equation]]s that described [[electromagnetic]] radiation as waves.

The theory of electromagnetic radiation treats light, radio waves, microwaves and many other types of wave as the same thing except that they have different wavelengths. The wavelength of light is between 400 and 600&nbsp;nm,<ref group = Note>0.0004 to 0.0006&nbsp;mm</ref> the wavelength of radio waves varies from 10&nbsp;m to 1500&nbsp;m and the wavelength of microwaves is about 2&nbsp;cm. In a [[vacuum]], all electromagnetic waves travel at the [[speed of light]]. The frequency of the electromagnetic wave is given by:

:<math>\nu = \frac{c}{\lambda}</math>.

The symbols are defined [[#PlanckSymbolTable|here]].

=== Black body radiators ===
All hot bodies give off [[Radiant heating|radiant heat]]. Radiant heat is electromagnetic radiation. Normally this radiation is in the [[infra-red]] range, but if the body is very hot (1000&nbsp;°C or more), it is in the visible range. In the late 1800's many scientists studied wavelength of electromagnetic radiation from [[black-body radiation|black-body radiators]] at different temperatures.

==== Rayleigh-Jeans Law ====
[[File:Black body.svg|200px|thumb|Rayleigh-Jeans curve and Planck's curve plotted against photon wavelength.]]
[[John William Strutt, 3rd Baron Rayleigh|Lord Rayleigh]] first published the basics of the [[Rayleigh-Jeans law]] in 1900. The theory was based on the [[Kinetic theory]] of [[gas]]ses. Sir James Jeans published a more complete theory in 1905. The law relates the quantity and wavelength of electromagnetic energy given off by a black body radiator at different temperatures. The equation describing this is:<ref name=Lakoba>{{cite web
|url = http://www.cems.uvm.edu/~tlakoba/AppliedUGMath/notes/lecture_13.pdf
|title = Lecture notes and supporting material for MATH  235 - Mathematical Models and Their Analysis
|first1 = T
|last1 = Lakoba
|publisher = University of Vermont
|accessdate = 25 February 2014
|at = 13. Black-body radiation and Planck's formula}}</ref>  
:<math>B_\lambda(T) = \frac{2 c k T}{\lambda^4}</math>.

For long-wavelength radiation, the results predicted by this equation corresponded well with practical results obtained in a laboratory. However, for short wavelengths (ultraviolet light) the difference between theory and practice were so large that it earned the nickname "[[the ultra-violet catastrophe]]".

==== Planck's Law ====
in 1895 Wien published the results of his studies into the radiation from a black body. His formula was:
 
:<math>B_\lambda(T) = \frac{2 h c^2} {\lambda^5} e^{-\frac{hc}{\lambda kT}}</math>.

This formula worked well for short wavelength electromagnetic radiation, but did not work well with long wavelengths.

In 1900 [[Max Planck]] published the results of his studies. He tried to develop an expression for [[black-body radiation]] expressed in terms of wavelength by assuming that radiation consisted of small quanta and then to see what happened if the quanta were made infinitely small. (This is a standard mathematical approach). The expression was:<ref name="Planck01">{{citation 
| first = Max 
| last = Planck 
| author-link = Max Planck 
| title = Ueber das Gesetz der Energieverteilung im Normalspectrum 
| url = http://www.physik.uni-augsburg.de/annalen/history/historic-papers/1901_309_553-563.pdf 
| journal = [[Annalen der Physik|Ann. Phys.]] 
| year = 1901 
| volume = 309 
| issue = 3 
| pages = 553-63 
| doi = 10.1002/andp.19013090310|bibcode = 1901AnP...309..553P }}. English translation: "[http://people.isy.liu.se/jalar/kurser/QF/references/Planck1901.pdf On the Law of Distribution of Energy in the Normal Spectrum]".</ref>
 
:<math>B_\lambda(T) = \frac{2 h c^2}{\lambda^5}~\frac{1}{e^\frac{hc}{\lambda kT}-1}</math>.

If the wavelength of light is allowed to become very large, then it can be shown that the Raleigh-Jeans and the Planck relationships are almost identical.

He calculated ''h'' and ''k'' and found that
:h = {{val|6.55|e=-27}} erg·sec.
:k = {{val|1.34|e=-16}} erg·deg<sup>-1</sup>.

The values are close to the modern day accepted values of {{val|6.62606|e=-34}} and {{val|1.38065|e=-16}} respectively. The Planck law agrees well with the experimental data, but its full significance was only appreciated several years later.

=== Quantum theory of light ===
[[File:1911 Solvay conference.jpg|thumb|300px|Solway Conference 1911. [[Max Planck|Planck]], [[Albert Einstein|Einstein]] and Jeans are standing. Planck is second from the left. Einstein is second from the right. Jeans is fifth from the right. Wien is seated, third from the right]]

It turns out that electrons are dislodged by the [[photoelectric effect]] if light reaches  a threshold frequency. Below this no electrons can be emitted from the metal. In 1905 [[Albert Einstein]] published a paper explaining the effect. Einstein proposed that a beam of light is not a wave propagating through space, but rather a collection of discrete wave packets ([[photons]]), each with energy. Einstein said that the effect was due to a photon striking an electron. This demonstrated the particle nature of light.

Einstein also found that electromagnetic radiation with a long wavelength had no effect. Einstein said that this was because the "particles" did not have enough energy to disturb the electrons.<ref>{{cite speech
|title = The NobelPrize in Physics 1921, ALbert Einstein, Presentation Speech 
|url = http://www.nobelprize.org/nobel_prizes/physics/laureates/1921/press.html
|first1 = S
|last1 = Arrhenius
|date = 10 December 1922
|event = Nobel Prize award ceremony
|location = Stockholm}}</ref><ref>[http://www.pha.jhu.edu/~c173_608/photoelectric/photoelectric.html next ref]</ref><ref>[http://users.physik.fu-berlin.de/~kleinert/files/eins_lq.pdf Einstein acknowledged Planck]</ref>

Einstein realized that the energy of each photon was related to the photon frequency by the Planck constant. This could be written mathematically as:

:<math>E = h\nu = \frac {hc} {\lambda}</math>.

In 1921 Einstein received the [[Nobel Prize]] for linking the Planck constant to the photoelectric effect.

==Application==
The Planck constant is of importance in many applications. A few are listed below.
 
===Bohr model of the atom===
[[File:Bohr-atom-PAR.svg|thumb|Bohr's model of the atom. An electron falling from the n=3 shell to the n=2 shell loses energy.  This energy is carried away as a single photon.]]
[[File:Visible spectrum of neon.jpg|thumb|Visible spectrum of Neon. Each line represents a different pair of energy levels.]]
In 1913 [[Niels Bohr]] published the [[Bohr model]] of the structure of an atom. Bohr said that the [[angular momentum]] of the [[electron]]s going around the [[nucleus]] can only have certain values. These values are given by the equation

:<math>L=n\frac{h}{2\pi}</math>

where
:L = angular momentum associated with a level.
:n = [[integer|positive integer]].
:h = Planck constant.

The Bohr model of the atom can be used to calculate the energy of electrons at each level. Electrons will normally fill up the lowest numbered states of an atom. If the atom receives energy from, for example, an electric current, electrons will be excited into a higher state. The electron will then drop back to a lower state and will loose their extra energy by giving off a photon. Because the energy levels have specific values, the photons will have specific energy levels. Light emitted in this way can be split into different colours using a prism. Each element has its own pattern. The pattern for neon is shown alongside.

=== Heisenberg's uncertainty principle ===
In 1927 [[Werner Heisenberg]] published the [[uncertainty principle]]. The principle states that it is not possible to make a measurement without disturbing the thing being measured. It also puts a limit on the minimum disturbance caused by making a measurement.

In the [[macroscopic]] world these disturbances make very little difference. For example, if the [[temperature]] of a flask of liquid is measured, the [[thermometer]] will absorb a small amount of energy as it heats up. This will cause a small error in the final reading, but this error is small and not important.

In [[quantum mechanics]] things are different. Some measurements are made by looking at the pattern of scattered [[photon]]s.  One such example is [[Compton scattering]]. If both the position and momentum of a particle is being measured, the uncertainty principle states that there is a trade-off between the accuracy with which the momentum is measured and the accuracy with which the position is measured. The equation that describes this trade-off is:  
 
:<math>\Delta x \, \Delta p\gtrsim h\qquad\qquad\qquad </math>
where
:Δp = uncertainty in momentum.
:Δx = uncertainty in position.
:h = Planck constant.

=== Colour of light emitting diodes ===
[[File:PnJunction-LED-E.svg|thumb|Simple LED circuit that illustrates use of the Planck constant. The colour of the light emitted depends on the voltage drop across the diode. The wavelength of the light can be calculated using the Planck constant.<ref name=Ducharme>{{cite web
|url = http://mrsec.unl.edu/RET2008/PlanckAnnotations%5B1%5D.ppt
|title = Measuring Planck’s Constant with LEDs
|first1 = Stephen
|last1 = Ducharme
|year = 2008
|publisher = Materials Research Science and Engineering Center, [[University of Nebraska–Lincoln]]
|accessdate = 12 February 2012}}</ref>]] 
In the electric circuit shown on the right, the voltage drop across the light emitting diode (LED) depends on the material of the LED. For silicon diodes the drop is 0.6&nbsp;V. However for [[Light emitting diodes|LEDs]] it is between 1.8&nbsp;V and 2.7&nbsp;V. This information enables a user to calculate the Planck constant.<ref name=Ducharme/>

The energy needed for one electron to jump the [[Quantum mechanics|potential barrier]] in the LED material is given by   
:<math>E = Q_eV_L \,</math>
where
:''Q<sub>e</sub>'' is the charge on one electron.
:''V<sub>L</sub>'' is the voltage drop across the LED.

When the electron decays back again, it emits one photon of light. The energy of the photon is given by
the [[#Quantum theory of light|same equation]] used in the photoelectric effect. If these equations are combined, the wavelength of light and the voltage are related by
:<math> \lambda  = \frac {hc} {V_L Q_e} \,</math>

The table below can be calculated from this relationship.
{| class="wikitable"
|-
!Colour
!Wavelength<br>([[nanometre|nm]])<Ref group = Note>1000&nbsp;nm = 0.001&nbsp;mm</ref>
!Voltage
|-
|[[Red|red light]] 
|align="center"|650
|align="center"|1.89
|-
|[[Green|green light]]
|align="center"|550
|align="center"|2.25
|-
|[[Blue|blue light]]
|align="center"|470
|align="center"|2.62
|}

== Value of the Planck constant and the kilogram redefinition ==

Since its discovery, measurements of h have become much better. Planck first quoted the value of h to be {{val|6.55|e=-27}} erg·sec. This value is within 5% of the current value.

As of 3 March 2014, the best measurements of h in [[International System of Units|SI units]] is {{val|6.62606957|e=-34}}&nbsp;J·s. The equivalent figure in [[centimetre-gram-second|cgs units]] is {{val|6.62606957|e=-27}}&nbsp;erg·sec. The is  relative uncertainty of h is {{val|4.4|e=-8}}.

The reduced Planck constant (ħ) is a value that is sometimes used in [[quantum mechanics]]. It is defined by

:<math>\hbar = \frac{h}{2 \pi}</math>.

[[Planck units]] are sometimes used in quantum mechanics instead of SI. In this system the reduced Planck constant has a value of 1, so the value of the Planck constant is 2π.
 
Plancks constant can now be measured with very high precision. This has caused the [[BIPM]] to consider a new definition for the kilogram.  They have proposed that the [[Kilogram|international prototype kilogram]] is no longer used to define the kilogram. Instead the BIPM will define the Planck constant to have an exact value. Scientists will use this value and the definitions of the metre and the second to define the kilogram.<ref>
{{cite web 
|author=Ian Mills 
|title=Draft Chapter 2 for SI Brochure, following redefinitions of the base units 
|publisher=BIPM 
|url=http://www.bipm.org/utils/common/pdf/si_brochure_draft_ch2.pdf 
|date=27 September 2010 
|accessdate=3 March 2014}}
</ref>

== Related pages ==
* [[Wave–particle duality]]

== Notes ==
{{Reflist|group=Note}}

== References ==
{{reflist}}


[[Category:Numbers]]
[[Category:Physics]]`
let doc = wtf(str)
console.log(doc.table().json())

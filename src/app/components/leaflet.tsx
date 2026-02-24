import React from 'react';

import EditableDiv from '@/app/components/editableDiv';
import { Mars, Venus, Plus } from 'lucide-react';
import { LeafletData, LeafletSection, LeafletTextfield } from '@/types/leaflet';
import { defaultLeafletData } from '@/data/leaflet';

export const leafletDataLocalStorageKey = 'leafletData';

const SCALE_FACTOR = 1.5; // Adjust this value to scale the leaflet

interface LeafletProps {
  passedLeafletData?: LeafletData | null; // Optional prop to pass leaflet data
}

export default function Leaflet(props: LeafletProps) {
  const initialLeafletData = props.passedLeafletData || null;
  const [leafletData, setLeafletData] =
    React.useState<LeafletData>(defaultLeafletData);

  // if query parameter clear is present, clear localStorage
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clear = urlParams.get('clear');
    if (clear === 'true') {
      localStorage.removeItem(leafletDataLocalStorageKey);
      // Reset the leaflet data to default
      setLeafletData(defaultLeafletData);
    }
  }, []);

  // Load from localStorage on client after mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(leafletDataLocalStorageKey);
      // If initialLeafletData is provided, use it; otherwise, use stored data or default
      if (initialLeafletData) {
        setLeafletData(initialLeafletData);
        return;
      }

      if (stored) {
        try {
          setLeafletData(JSON.parse(stored) as LeafletData);
        } catch {
          setLeafletData(defaultLeafletData);
        }
      }
    }
  }, []);

  // on rerender, if initialLeafletData is provided, update leafletData
  React.useEffect(() => {
    if (initialLeafletData) {
      setLeafletData(initialLeafletData);
    }
  }, [initialLeafletData]);

  // function to change the image source by clicking on it and selecting file
  const handleImageClick = (clickEvent: React.MouseEvent<HTMLImageElement>) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (!file) return;
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = event.target?.result as string;
        const buttonElement = clickEvent.target as HTMLImageElement;
        const containerElement = buttonElement.closest('.group') as HTMLElement;
        const imageElement = containerElement.querySelector('img');

        if (!imageElement) return;

        imageElement.src = img; // Update the image source

        imageElement.classList.remove('hidden'); // Show the image
        containerElement.querySelector('div')?.classList.add('hidden');
        containerElement.querySelector('div')?.classList.remove('flex');

        // Update leaflet data with the new image source
        setLeafletData((prevData) => ({
          ...prevData,
          imageSrc: img,
        }));
      };
      reader.readAsDataURL(file);
      input.remove();
    };
    input.click();
  };

  /* on change of leafletData, update saved data in localStorage */
  React.useEffect(() => {
    localStorage.setItem(
      leafletDataLocalStorageKey,
      JSON.stringify(leafletData)
    );

    // console.log('Leaflet data updated:', leafletData);
  }, [leafletData]);

  /* on paste remove all formatting from the pasted text and paste it as plain text */
  React.useEffect(() => {
    document.addEventListener('paste', (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') ?? '';
      document.execCommand('insertText', false, text);
    });
  }, []);

  /* on load focus on the data-focus element */
  React.useEffect(() => {
    const focusElement = document.querySelector('[data-focus]');
    if (focusElement) {
      (focusElement as HTMLElement).focus();
      (focusElement as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  return (
    <div
      style={{
        background: 'white',
        paddingTop: `calc(32px * ${SCALE_FACTOR})`,
        paddingLeft: `calc(28px * ${SCALE_FACTOR})`,
        paddingRight: `calc(28px * ${SCALE_FACTOR})`,
        paddingBottom: `calc(40px * ${SCALE_FACTOR})`,
        boxShadow: '0 25px 50px -12px #3e668861',
        width: `calc(595px * ${SCALE_FACTOR})`,
        // minHeight: `calc(842px * ${SCALE_FACTOR})`,
        position: 'relative',
      }}
    >
      <div
        className="relative"
        id="leaflet"
        style={{
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: `calc(10px * ${SCALE_FACTOR})`,
          minHeight: `calc((842px - 72px) * ${SCALE_FACTOR})`,
        }}
      >
        {/* Footer text in the corner of the leaflet */}
        <div
          style={{
            position: 'absolute',
            left: 'auto',
            right: `calc(4px * ${SCALE_FACTOR})`,
            top: `calc((842px - 72px - 10px) * ${SCALE_FACTOR})`,
            color: '#B4B4B4',
            fontSize: `calc(7px * ${SCALE_FACTOR})`,
            transform: 'translateX(100%) rotate(-90deg) ',
            transformOrigin: 'left',
            whiteSpace: 'nowrap',
            display: 'none',
          }}
          data-show-on-export
        >
          guryn.ru
        </div>

        {/* Header section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `calc(6px * ${SCALE_FACTOR})`,
            }}>
            <EditableDiv
              value={leafletData.profession.value}
              onChange={(value) =>
                setLeafletData((prevData) => ({
                  ...prevData,
                  profession: {
                    ...prevData.profession,
                    value,
                  } as LeafletTextfield,
                }))
              }
              contentEditable={true}
              placeholder={leafletData.profession.placeholder}
              style={{
                fontWeight: 'bold',
                fontSize: `calc(24px * ${SCALE_FACTOR})`,
                lineHeight: '1',
                width: `calc(380px * ${SCALE_FACTOR})`,
              }}
            />

            {/* Professional Skills */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `calc(10px * ${SCALE_FACTOR})`,
              }}
            >
              <EditableDiv
                value={leafletData.professionSkills?.value}
                onChange={(value) =>
                  setLeafletData((prevData) => ({
                    ...prevData,
                    professionSkills: {
                      ...prevData.professionSkills,
                      value,
                    },
                  }))
                }
                contentEditable={true}
                placeholder={leafletData.professionSkills?.placeholder}
                style={{
                  fontWeight: 'bold',
                  fontSize: `calc(12px * ${SCALE_FACTOR})`,
                  lineHeight: '1',
                }}
              />
            </div>

          </div>
          <div
            style={{
              width: `calc(125px * ${SCALE_FACTOR})`,
              height: `calc(125px * ${SCALE_FACTOR})`,
            }}
            className="flex-shrink-0 group relative hover:cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              className={leafletData.imageSrc ? 'block' : 'hidden'}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              src={leafletData.imageSrc}
              alt="Cat"
            />
            <div
              className={`${leafletData.imageSrc ? 'hidden' : 'flex'} group-hover:flex text-center absolute w-full h-full top-0 items-center justify-center bg-[#ffffffbb] border border-dashed border-[#3e668832] hover:border-[#3e668861] backdrop-blur-xs`}
            >
              <span
                style={{
                  fontSize: `calc(12px * ${SCALE_FACTOR})`,
                  color: '#3e6688',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  width: '100%',
                  userSelect: 'none',
                }}
              >
                Ваша
                <br />
                фотография
              </span>
            </div>
          </div>
        </div>

        {/* Sections and asideSection */}
        <div
          className=""
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: `calc(380px * ${SCALE_FACTOR})`,
              gap: `calc(20px * ${SCALE_FACTOR})`,
            }}
          >
            {/* Overview */}
            {leafletData.overview && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `calc(10px * ${SCALE_FACTOR})`,
                }}
              >
                <EditableDiv
                  value={leafletData.overview.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => ({
                      ...prevData,
                      overview: {
                        ...prevData.overview,
                        value,
                      },
                    }))
                  }
                  contentEditable={true}
                  placeholder={leafletData.overview.placeholder}
                  style={{
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1.3',
                    minHeight: `calc(68px * ${SCALE_FACTOR})`,
                  }}
                />
              </div>
            )}

            {/* Skills */}
            {(leafletData.skills || []).map((skill, skillIndex) => (
              <div
                key={`skill-${skillIndex}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `calc(10px * ${SCALE_FACTOR})`,
                }}
              >
                <EditableDiv
                  value={skill.direction.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedSkills = [...(prevData.skills || [])];
                      updatedSkills[skillIndex] = {
                        ...updatedSkills[skillIndex],
                        direction: { ...updatedSkills[skillIndex].direction, value },
                      };
                      return { ...prevData, skills: updatedSkills };
                    })
                  }
                  contentEditable={true}
                  placeholder={skill.direction.placeholder}
                  style={{
                    fontWeight: 'bold',
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={skill.skillsList.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedSkills = [...(prevData.skills || [])];
                      updatedSkills[skillIndex] = {
                        ...updatedSkills[skillIndex],
                        skillsList: { ...updatedSkills[skillIndex].skillsList, value },
                      };
                      return { ...prevData, skills: updatedSkills };
                    })
                  }
                  contentEditable={true}
                  placeholder={skill.skillsList.placeholder}
                  style={{
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1.3',
                  }}
                />
              </div>
            ))}

            {/* Experience */}
            {(leafletData.experience || []).map((job, jobIndex) => (
              <div
                key={`job-${jobIndex}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `calc(10px * ${SCALE_FACTOR})`,
                }}
              >
                <EditableDiv
                  value={job.position.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedExperience = [...(prevData.experience || [])];
                      updatedExperience[jobIndex] = {
                        ...updatedExperience[jobIndex],
                        position: { ...updatedExperience[jobIndex].position, value },
                      };
                      return { ...prevData, experience: updatedExperience };
                    })
                  }
                  contentEditable={true}
                  placeholder={job.position.placeholder}
                  style={{
                    fontWeight: 'bold',
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={job.company.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedExperience = [...(prevData.experience || [])];
                      updatedExperience[jobIndex] = {
                        ...updatedExperience[jobIndex],
                        company: { ...updatedExperience[jobIndex].company, value },
                      };
                      return { ...prevData, experience: updatedExperience };
                    })
                  }
                  contentEditable={true}
                  placeholder={job.company.placeholder}
                  style={{
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={job.duration.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedExperience = [...(prevData.experience || [])];
                      updatedExperience[jobIndex] = {
                        ...updatedExperience[jobIndex],
                        duration: { ...updatedExperience[jobIndex].duration, value },
                      };
                      return { ...prevData, experience: updatedExperience };
                    })
                  }
                  contentEditable={true}
                  placeholder={job.duration.placeholder}
                  style={{
                    fontSize: `calc(10px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={job.description.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedExperience = [...(prevData.experience || [])];
                      updatedExperience[jobIndex] = {
                        ...updatedExperience[jobIndex],
                        description: { ...updatedExperience[jobIndex].description, value },
                      };
                      return { ...prevData, experience: updatedExperience };
                    })
                  }
                  contentEditable={true}
                  placeholder={job.description.placeholder}
                  style={{
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1.3',
                  }}
                />
              </div>
            ))}

            {/* Education */}
            {(leafletData.education || []).map((edu, eduIndex) => (
              <div
                key={`education-${eduIndex}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `calc(10px * ${SCALE_FACTOR})`,
                }}
              >
                <EditableDiv
                  value={edu.place.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedEducation = [...(prevData.education || [])];
                      updatedEducation[eduIndex] = {
                        ...updatedEducation[eduIndex],
                        place: { ...updatedEducation[eduIndex].place, value },
                      };
                      return { ...prevData, education: updatedEducation };
                    })
                  }
                  contentEditable={true}
                  placeholder={edu.place.placeholder}
                  style={{
                    fontWeight: 'bold',
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={edu.duration.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedEducation = [...(prevData.education || [])];
                      updatedEducation[eduIndex] = {
                        ...updatedEducation[eduIndex],
                        duration: { ...updatedEducation[eduIndex].duration, value },
                      };
                      return { ...prevData, education: updatedEducation };
                    })
                  }
                  contentEditable={true}
                  placeholder={edu.duration.placeholder}
                  style={{
                    fontSize: `calc(10px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={edu.description.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedEducation = [...(prevData.education || [])];
                      updatedEducation[eduIndex] = {
                        ...updatedEducation[eduIndex],
                        description: { ...updatedEducation[eduIndex].description, value },
                      };
                      return { ...prevData, education: updatedEducation };
                    })
                  }
                  contentEditable={true}
                  placeholder={edu.description.placeholder}
                  style={{
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1.3',
                  }}
                />
              </div>
            ))}

            {/* Additional Skills */}
            {(leafletData.additionalSkills || []).map((skill, skillIndex) => (
              <div
                key={`additional-skill-${skillIndex}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `calc(10px * ${SCALE_FACTOR})`,
                }}
              >
                <EditableDiv
                  value={skill.direction.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedSkills = [...(prevData.additionalSkills || [])];
                      updatedSkills[skillIndex] = {
                        ...updatedSkills[skillIndex],
                        direction: { ...updatedSkills[skillIndex].direction, value },
                      };
                      return { ...prevData, additionalSkills: updatedSkills };
                    })
                  }
                  contentEditable={true}
                  placeholder={skill.direction.placeholder}
                  style={{
                    fontWeight: 'bold',
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1',
                  }}
                />
                <EditableDiv
                  value={skill.skillsList.value}
                  onChange={(value) =>
                    setLeafletData((prevData) => {
                      const updatedSkills = [...(prevData.additionalSkills || [])];
                      updatedSkills[skillIndex] = {
                        ...updatedSkills[skillIndex],
                        skillsList: { ...updatedSkills[skillIndex].skillsList, value },
                      };
                      return { ...prevData, additionalSkills: updatedSkills };
                    })
                  }
                  contentEditable={true}
                  placeholder={skill.skillsList.placeholder}
                  style={{
                    fontSize: `calc(11px * ${SCALE_FACTOR})`,
                    lineHeight: '1.3',
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{ width: `calc(125px * ${SCALE_FACTOR})`, flexShrink: 0 }}
          >
            {/* Name */}
            <div
              style={{
                display: 'flex',
                gap: `calc(2px * ${SCALE_FACTOR})`,
                justifyContent: 'start',
                alignItems: 'stretch',
                marginBottom: `calc(10px * ${SCALE_FACTOR})`,
              }}
            >
              <EditableDiv
                value={leafletData.name.value}
                onChange={(value) =>
                  setLeafletData((prevData) => ({
                    ...prevData,
                    name: {
                      ...prevData.name,
                      value,
                    } as LeafletTextfield,
                  }))
                }
                contentEditable={true}
                placeholder={leafletData.name.placeholder}
                style={{
                  fontSize: `calc(12px * ${SCALE_FACTOR})`,
                  lineHeight: '1',
                  width: '100%',
                }}
              />
            </div>

            {/* City */}
            <div
              style={{
                display: 'flex',
                gap: `calc(2px * ${SCALE_FACTOR})`,
                justifyContent: 'start',
                alignItems: 'stretch',
                marginBottom: `calc(10px * ${SCALE_FACTOR})`,
              }}
            >
              <EditableDiv
                value={leafletData.city.value}
                onChange={(value) =>
                  setLeafletData((prevData) => ({
                    ...prevData,
                    city: {
                      ...prevData.city,
                      value,
                    } as LeafletTextfield,
                  }))
                }
                contentEditable={true}
                placeholder={leafletData.city.placeholder}
                style={{
                  fontSize: `calc(12px * ${SCALE_FACTOR})`,
                  lineHeight: '1',
                  width: '100%',
                }}
              />
            </div>

            {/* Contacts */}
            <div
              style={{
                fontSize: `calc(9px * ${SCALE_FACTOR})`,
                lineHeight: '1.3',
                gap: `calc(6px * ${SCALE_FACTOR})`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {(leafletData.contacts || []).map(
                (textfield: LeafletTextfield, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: `calc(2px * ${SCALE_FACTOR})`,
                    }}
                  >
                    <EditableDiv
                      value={textfield.value}
                      onChange={(value) =>
                        setLeafletData((prevData) => {
                          const updatedContacts = [
                            ...prevData.contacts,
                          ];
                          updatedContacts[index] = {
                            ...updatedContacts[index],
                            value: value,
                          };
                          return {
                            ...prevData,
                            contacts: updatedContacts,
                          };
                        })
                      }
                      contentEditable={true}
                      placeholder={textfield.placeholder}
                      style={{}}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';

const AboutUs = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">ArchiLog</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-3">ArchiLog 소개</h2>
                <p className="text-lg leading-relaxed">
                    ArchiLog는 IT 취업 준비생을 위한 차별화된 온라인 이력서 플랫폼입니다.<br/> 
                    사용자는 자신의 기술과 경험을 전문적으로 표현할 수 있으며, 프로젝트와 블로그 기능을 통해 포트폴리오를 체계적으로 관리할 수 있습니다.<br/> 
                    ArchiLog는 마치 자신만의 이력서 사이트처럼 구성되어, 구직 과정에서 강력한 인상을 남길 수 있도록 도와줍니다.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-6">핵심 기능</h2>
                <div className="space-y-12">
                    {/* About Me 섹션 */}
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3">About Me</h3>
                            <p className="text-lg leading-relaxed">
                                사용자가 자신의 이력서를  Markdown으로 직접 작성하여 메인 페이지에 표시하는 공간입니다.<br/>
                                Markdown을 사용하여 이력서를 다양하게 작성할 수 있으며,
                                이력서의 구조, 내용, 그리고 디자인을 유연하게 작성 할 수 있습니다.<br/>
                                표준화된 템플릿 대신 개성을 반영한 맞춤형 이력서를 손쉽게 만들어 보세요.
                            </p>
                        </div>
                        <div className="relative w-full md:w-96 h-64 rounded-lg overflow-hidden">
                            <Image
                                src="/images/mypage.png"
                                alt="About Me 페이지 미리보기"
                                fill
                                className="object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Project 섹션 */}
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3">Project</h3>
                            <p className="text-lg leading-relaxed">
                                실시간으로 GitHub와 연동되어 깃허브에 올려둔 자신의 프로젝트를 ArchiLog로 가져와 게시할 수 있습니다.<br/>
                                이 기능을 통해 자신의 기술력을 실시간으로 업데이트하고, 공유할 수 있으며 발표자료 및 프로젝트를 쉽고, 효율적으로 관리할 수 있습니다.

                            </p>
                        </div>
                        <div className="relative w-full md:w-96 h-64 rounded-lg overflow-hidden">
                            <Image
                                src="/images/project.png"
                                alt="Project 페이지 미리보기"
                                fill
                                className="object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Blog 섹션 */}
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3">Blog</h3>
                            <p className="text-lg leading-relaxed">
                                개발 중 겪은 문제와 해결 과정을 마크다운 형식으로 기록할 수 있습니다. 
                                이력서와 프로젝트 외에도 학습 기록을 남겨 자기 개발 과정을 꾸준히 보여줄 수 있습니다.<br/>
                                자신만의 블로그를 만들어 보세요!!
                            </p>
                        </div>
                        <div className="relative w-full md:w-96 h-64 rounded-lg overflow-hidden">
                            <Image
                                src="/images/blog.png"
                                alt="Blog 페이지 미리보기"
                                fill
                                className="object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">ArchiLog가 IT 취준생에게 필요한 이유</h2>
                <p className="text-lg leading-relaxed">
                    ArchiLog는 단순한 포트폴리오 사이트를 넘어, 자기 자신을 완성도 높게 표현할 수 있는 개인 이력서입니다. <br/>
                    복잡한 코딩이나 디자인 없이 자신의 경험과 기술력을 직관적이고 명확하게 전달할 수 있습니다. 
                    ArchiLog의 강력한 기능을 활용하여 경쟁력 있는 포트폴리오와 이력서를 완성해보세요.
                </p>
            </section>
        </div>
    );
};

export default AboutUs;
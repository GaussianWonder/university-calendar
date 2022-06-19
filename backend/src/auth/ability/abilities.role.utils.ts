// The RoleIdentifier works with decoupled role information types such that Model Roles can support different titles and categories.

export interface RoleInfo<Subject, Title> {
  subject: Subject;
  subjectId: number;
  title: Title;
}

export type Mapper<T, U> = (t: T) => U;

/**
 * A class that provides useful information regarding a role array of a given category.
 *
 * @export
 * @class RoleIdentifier
 * @template Subject The subject this role targets. Usually one of the models
 * @template SubjectRole The Role type for <Subject> model.
 * @template RoleTitle The Title type for <SubjectRole>, usually a string, string literals, enum, etc.
 */
export default class RoleIdentifier<Subject, SubjectRole, RoleTitle> {
  private roleInfoProvider: Mapper<SubjectRole, RoleInfo<Subject, RoleTitle>>;
  private titlesMap: Map<number, RoleInfo<Subject, RoleTitle>[]> = new Map();

  /**
   * Creates an instance of RoleIdentifier.
   * @param {Mapper<SubjectRole, RoleInfo<Subject, RoleTitle>>} roleInfoProvider maps a SubjectRole to a general form of Role to be worked with internally
   * @param {(SubjectRole[] | null)} [roleArray=null] optional init array to pass the mapper through
   * @memberof RoleIdentifier
   */
  constructor(
    roleInfoProvider: Mapper<SubjectRole, RoleInfo<Subject, RoleTitle>>,
    roleArray: SubjectRole[] | null = null,
  ) {
    this.roleInfoProvider = roleInfoProvider;
    if (roleArray != null) {
      this.from(roleArray);
    }
  }

  /**
   * After successfully initializing the RoleIdentifier with a roleInfoProvider,
   *  you can use this to append RoleInfo objects after creation.
   *
   * @param {SubjectRole[]} roleArray an array of SubjectRole objects
   * @return {RoleIdentifier} this
   * @memberof RoleIdentifier
   */
  public from(roleArray: SubjectRole[]) {
    roleArray.map(this.roleInfoProvider).forEach((roleInfo) => {
      const { subjectId } = roleInfo;
      const titles = this.titlesMap.get(subjectId) || [];
      titles.push(roleInfo);
      this.titlesMap.set(subjectId, titles);
    });
    return this;
  }

  public titlesOf(id: number): RoleInfo<Subject, RoleTitle>[] {
    return this.titlesMap.get(id) || [];
  }

  public hasTitleFor(id: number): boolean {
    return this.titlesMap.has(id);
  }

  public has(id: number, title: RoleTitle): boolean {
    const titles = this.titlesOf(id);
    return titles.some((t) => t.title === title);
  }

  public not(id: number, title: RoleTitle): boolean {
    if (!this.hasTitleFor(id)) return false; //* important
    const titles = this.titlesOf(id);
    return titles.every((t) => t.title !== title);
  }

  public hasAnyOf(id: number, titles: RoleTitle[]): boolean {
    const subjectTitles = this.titlesOf(id);
    return subjectTitles.some((t) => titles.includes(t.title));
  }

  public hasAllOf(id: number, titles: RoleTitle[]): boolean {
    const subjectTitles = this.titlesOf(id);
    return (
      subjectTitles.length &&
      titles.every((t) => subjectTitles.some((st) => st.title === t))
    );
  }

  /**
   * General match function that takes a predicate and returns RoleInfo objects
   *
   * @param {(role: RoleInfo<Subject, RoleTitle>) => boolean} predicate
   * @return {*}  {RoleInfo<Subject, RoleTitle>[]}
   * @memberof RoleIdentifier
   */
  public rolesMatching(
    predicate: (role: RoleInfo<Subject, RoleTitle>) => boolean,
  ): RoleInfo<Subject, RoleTitle>[] {
    return this.ids
      .map((id) => this.titlesOf(id))
      .flat()
      .filter(predicate);
  }

  /**
   * Same as rolesMatching, but maps the result to ids instead of keeping the whole RoleInfo object.
   *
   * @param {(role: RoleInfo<Subject, RoleTitle>) => boolean} predicate
   * @return {*}  {number[]}
   * @memberof RoleIdentifier
   */
  public idsMatching(
    predicate: (role: RoleInfo<Subject, RoleTitle>) => boolean,
  ): number[] {
    return this.rolesMatching(predicate).map((role) => role.subjectId);
  }

  /**
   * Returns an array of all subjectIds that have a title in the titleMap
   *
   * @readonly
   * @memberof RoleIdentifier
   */
  get ids() {
    return Array.from(this.titlesMap.keys());
  }

  /**
   * For every matched RoleTitle in the titleMap, call the callback function.
   *
   * @param {Array<[RoleTitle, (info: RoleInfo<Subject, RoleTitle>) => void]>} matchers
   * @memberof RoleIdentifier
   */
  public match(
    matchers: Array<[RoleTitle, (info: RoleInfo<Subject, RoleTitle>) => void]>,
  ) {
    this.ids.forEach((id) => {
      matchers.forEach(([title, callback]) => {
        if (this.has(id, title)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          callback(this.titlesOf(id).find((t) => t.title === title)!);
        }
      });
    });
  }

  /**
   * For every RoleTitle different from the one provided, call the calback function.
   *
   * @param {Array<
   *       [RoleTitle, (info: RoleInfo<Subject, RoleTitle>[]) => void]
   *     >} matchers
   * @memberof RoleIdentifier
   */
  public notMatch(
    matchers: Array<
      [RoleTitle, (info: RoleInfo<Subject, RoleTitle>[]) => void]
    >,
  ) {
    this.ids.forEach((id) => {
      matchers.forEach(([title, callback]) => {
        if (this.not(id, title)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          callback(this.titlesOf(id).filter((t) => t.title !== title)!);
        }
      });
    });
  }

  /**
   * For any RoleTitle that can be found in the titleMap, call the callback function.
   * This does not serve many usecases, the input it provides to the callback function is hard to manage.
   * Use this only when don't actually need the parameter provided in the callback.
   *
   * @param {Array<
   *       [RoleTitle[], (info: RoleInfo<Subject, RoleTitle>[]) => void]
   *     >} matchers
   * @memberof RoleIdentifier
   */
  public multipleMatch(
    matchers: Array<
      [RoleTitle[], (info: RoleInfo<Subject, RoleTitle>[]) => void]
    >,
  ) {
    this.ids.forEach((id) => {
      matchers.forEach(([titles, callback]) => {
        if (this.hasAnyOf(id, titles)) {
          callback(this.titlesOf(id).filter((t) => titles.includes(t.title)));
        }
      });
    });
  }
}
